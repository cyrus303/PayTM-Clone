import React, {useState} from 'react';

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

  const handleFormChange = (element) => {
    const {id, value} = element;

    const updatedState = {
      ...formData,
      [id]: value,
    };

    console.log(formData);

    setFormData(updatedState);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        'http://localhost:3000/api/v1/user/signup',
        formData
      );
      console.log(response);
    } catch (error) {
      console.error('Error submitting form:', error.response.data);
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
            <div className="grid w-full items-center gap-4">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Username</Label>
                  <Input
                    type="email"
                    id="username"
                    placeholder="Johndoe@example.com"
                    value={formData.email}
                    onChange={(event) => {
                      handleFormChange(event.target);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  value={formData.firstname}
                  onChange={(event) => {
                    handleFormChange(event.target);
                  }}
                />
              </div>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input
                    id="lastname"
                    placeholder="Doe"
                    value={formData.lastname}
                    onChange={(event) => {
                      handleFormChange(event.target);
                    }}
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={(event) => {
                      handleFormChange(event.target);
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="secondary">Cancel</Button>
          <Button
            onClick={(event) => {
              handleFormSubmit(event);
            }}
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
