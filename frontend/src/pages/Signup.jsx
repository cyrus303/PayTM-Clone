import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (element) => {
    const {name, value} = element;
    const updatedState = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedState);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate email
    if (!formData.username) {
      newErrors.username = 'Email is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Must be 3 or more characters long';
      isValid = false;
    } else if (formData.username.length > 30) {
      newErrors.username = 'Muse be 30 or fewer characters long';
      isValid = false;
    } else {
      const isValidEmail =
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          formData.username
        );

      if (!isValidEmail) {
        newErrors.username = 'Email is not valid';
        isValid = false;
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Must be 6 or more characters long';
      isValid = false;
    }

    // Validate firstname
    if (!formData.firstname) {
      newErrors.firstname = 'Firstname is required';
      isValid = false;
    } else if (formData.firstname.length > 50) {
      newErrors.firstname = 'Muse be 50 or fewer characters long';
      isValid = false;
    }

    // Validate lastname
    if (!formData.lastname) {
      newErrors.lastname = 'Lastname is required';
      isValid = false;
    } else if (formData.lastname.length > 50) {
      newErrors.lastname = 'Muse be 50 or fewer characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    if (validateForm()) {
      console.log('Form data:', formData);
      try {
        const response = await axios.post(
          'http://localhost:3000/api/v1/user/signup',
          formData
        );
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } catch (error) {
        if (error.response.data.field === 'username') {
          setErrors((prev) => ({
            ...prev,
            username: error.response.data.message,
          }));
        }
        console.error('Error submitting form:', error.response.data);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-neutral-800">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-5">
              <div className="grid w-full items-center gap-4 relative">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Username</Label>
                  <Input
                    type="email"
                    id="username"
                    name="username"
                    placeholder="Johndoe@example.com"
                    value={formData.email}
                    onChange={(event) => {
                      handleInputChange(event.target);
                    }}
                    className={
                      errors.username && 'border-2 border-red-500'
                    }
                  />
                  {errors.username && (
                    <div className="absolute top-full right-0 text-red-500 text-xs">
                      {errors.username}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid w-full items-center gap-5">
                <div className="flex flex-col space-y-1.5 relative">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input
                    id="firstname"
                    placeholder="John"
                    name="firstname"
                    value={formData.firstname}
                    onChange={(event) => {
                      handleInputChange(event.target);
                    }}
                    className={
                      errors.firstname && 'border-2 border-red-500'
                    }
                  />
                  {errors.firstname && (
                    <div className="absolute top-full right-0 text-red-500 text-xs">
                      {errors.firstname}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid w-full items-center gap-5">
                <div className="flex flex-col space-y-1.5 relative">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    name="lastname"
                    value={formData.lastname}
                    onChange={(event) => {
                      handleInputChange(event.target);
                    }}
                    className={
                      errors.lastname && 'border-2 border-red-500'
                    }
                  />
                  {errors.lastname && (
                    <div className="absolute top-full right-0 text-red-500 text-xs">
                      {errors.lastname}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid w-full items-center gap-5">
                <div className="flex flex-col space-y-1.5 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={(event) => {
                      handleInputChange(event.target);
                    }}
                    className={
                      errors.password && 'border-2 border-red-500'
                    }
                  />
                  {errors.password && (
                    <div className="absolute top-full right-0 text-red-500 text-xs">
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 ">
          <Button
            className="w-full mt-2"
            onClick={(event) => {
              handleSubmit(event);
            }}
          >
            Sign Up
          </Button>
          <p>
            Already have an account ?{' '}
            <a
              className="border-b-2 border-black cursor-pointer"
              onClick={() => {
                navigate('/signin');
              }}
            >
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
