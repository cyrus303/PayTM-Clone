const z = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {userModel} = require('../Model/userModel');
const {JWT_SECRET} = require('../config');
const accountModel = require('../Model/accountModel');

const userController = {};

userController.userSignUp = async (req, res) => {
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

    const addBalance = await accountModel.create({
      userId: response._id,
      balance: Math.floor(Math.random() * 1000),
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
};

userController.userSignIn = async (req, res) => {
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
};

userController.updateUserDetails = async (req, res) => {
  const userUpdateSchema = z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, {message: 'Must be 6 or more characters long'})
      .optional(),
    firstname: z
      .string({
        required_error: 'Firstname is required',
      })
      .trim()
      .max(50, {message: 'Muse be 50 or fewer characters long'})
      .optional(),
    lastname: z
      .string({
        required_error: 'Firstname is required',
      })
      .trim()
      .max(50, {message: 'Muse be 50 or fewer characters long'})
      .optional(),
  });

  try {
    const {password, firstname, lastname} = req.body;
    const {userId} = req;

    const {success} = userUpdateSchema.safeParse(req.body);
    if (!success) {
      res.status(411).send({
        message: 'Error while updating information',
      });
    }

    const User = await userModel.findOne({_id: userId});

    let passwordHash = null;
    let updatedUserDetails = {};

    if (firstname) updatedUserDetails.firstname = firstname;
    if (lastname) updatedUserDetails.lastname = lastname;

    if (password) {
      const salt = await bcrypt.genSalt();
      passwordHash = await bcrypt.hash(password, salt);
      updatedUserDetails.password = passwordHash;
    }

    let UpdatedDetails = await userModel.findOneAndUpdate(
      {_id: userId},
      updatedUserDetails,
      {new: true}
    );
    res.status(200).send({message: 'Updated successfully'});
  } catch (error) {
    console.error('Error updating user:', error);
    res
      .status(500)
      .send({message: 'Error while updated information'});
  }
};

userController.findUsers = async (req, res) => {
  const filterSchema = z.object({
    filter: z.string().max(50),
  });

  const {success} = filterSchema.safeParse(req.query);

  if (!success) {
    return res.status(411).send({
      message: 'filter input error',
    });
  }

  try {
    const {filter} = req.query;
    const Users = await userModel
      .find({
        $or: [{firstname: filter}, {lastname: filter}],
      })
      .lean();

    const data = Users.map((userItem) => {
      const {password, ...dataWithoutPassword} = userItem;
      return dataWithoutPassword;
    });

    res.status(200).send({users: data});
  } catch (error) {
    console.error('Error reading user details:', error);
    res.status(500).send({error: 'Internal Server Error'});
  }
};

module.exports = userController;