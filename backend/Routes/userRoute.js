const express = require('express');
const router = express.Router();
const z = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {userModel} = require('../Model/userModel');
const {JWT_SECRET} = require('../config');
const authenticateUser = require('../Middleware/authenticateUser');

router.post('/signup', async (req, res) => {
  const {username, password, firstname, lastname} = req.body;

  const userSchema = z.object({
    username: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .email()
      .trim()
      .min(3, {message: 'Must be 3 or more characters long'})
      .max(30, {message: 'Muse be 30 or fewer characters long'}),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, {message: 'Must be 6 or more characters long'}),
    firstname: z
      .string({
        required_error: 'Firstname is required',
      })
      .trim()
      .max(50, {message: 'Muse be 50 or fewer characters long'}),
    lastname: z
      .string({
        required_error: 'Firstname is required',
      })
      .trim()
      .max(50, {message: 'Muse be 50 or fewer characters long'}),
  });

  try {
    userSchema.parse(req.body);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const response = await userModel.create({
      username,
      password: passwordHash,
      firstname,
      lastname,
    });

    const token = await jwt.sign({userId: response._id}, JWT_SECRET);

    res.status(200).json({
      message: 'User created successfullly',
      token,
    });
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyValue &&
      error.keyValue.username
    ) {
      const username = error.keyValue.username;
      const errorMessage = `The username "${username}" is already taken. Please choose a different username.`;
      console.log(errorMessage);
      return res.status(411).send({message: errorMessage});
    } else if (error instanceof z.ZodError) {
      console.log(error.issues);
      return res.send({error: error.issues});
    } else {
      console.log('Unknown error occurred:', error);
      return res.status(500).send({
        error,
      });
    }
  }
});

router.post('/signin', async (req, res) => {
  const signinBody = z.object({
    username: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .email()
      .trim()
      .min(3, {message: 'Must be 3 or more characters long'})
      .max(30, {message: 'Muse be 30 or fewer characters long'}),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, {message: 'Must be 6 or more characters long'}),
  });

  try {
    const {username, password} = req.body;
    const {success} = signinBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: 'Incorrect input formats',
      });
    }
    const DbResponse = await userModel.findOne({username});
    const passwordHash = DbResponse.password;
    const result = await bcrypt.compare(password, passwordHash);
    if (result) {
      const token = await jwt.sign(
        {userId: DbResponse._id},
        JWT_SECRET
      );

      res.status(200).json({
        message: 'User login successful',
        token,
      });
    } else {
      res.status(411).json({
        message: 'Username/Password incorrect',
      });
    }
  } catch (error) {
    console.log('Unknown error occurred:', error);
    res.status(500).send({
      error,
    });
  }
});

module.exports = router;
