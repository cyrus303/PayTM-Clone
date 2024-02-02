import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {currentUserAtom} from '@/store/atoms/userAtom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useRecoilState} from 'recoil';
import {Button} from '../ui/button';

import {useState} from 'react';

const Profile = () => {
  const [currentUser, setCurrentUser] =
    useRecoilState(currentUserAtom);

  const [formData, setFormData] = useState({
    firstname: currentUser.firstname,
    lastname: currentUser.lastname,
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
      console.log(formData);
      try {
        const response = await axios.put(
          'http://localhost:3000/api/v1/user/',
          formData,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        navigate('/dashboard');
      } catch (error) {
        console.error('Error submitting form:', error.response.data);
      }
    }
  };

  const handleTokenRefresh = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      'http://localhost:3000/api/v1/user/loggedInUser',
      {
        headers: {
          Authorization: token,
        },
      }
    );

    setCurrentUser(response.data);
  };

  useEffect(() => {
    handleTokenRefresh();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-neutral-800">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Change your profile deatils here
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
                    defaultValue={currentUser.username}
                    disabled
                  />
                </div>
              </div>
              <div className="grid w-full items-center gap-4 relative">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstname">Firstname</Label>
                  <Input
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="John"
                    value={currentUser.firstname}
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
              <div className="grid w-full items-center gap-4 relative">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastname">Lastname</Label>
                  <Input
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="doe"
                    value={currentUser.lastname}
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
                    type="text"
                    id="password"
                    name="password"
                    placeholder="******"
                    value={currentUser.password}
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
          <Button className="w-full mt-2" onClick={handleSubmit}>
            Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
