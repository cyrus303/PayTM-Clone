import {useState, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {Button} from '../ui/button';
import {useRecoilState, useRecoilValue} from 'recoil';
import {userListAtom} from '@/store/atoms/userAtom';
import axios from 'axios';

const UserDetails = () => {
  const MOCK_DATA = {
    users: [
      {
        _id: '65bb3ddc5ce0b0230d9929b5',
        username: 'testing@gmail.com',
        firstname: 'sachin',
        lastname: 'mahesh',
        __v: 0,
      },
      {
        _id: '65bb4ca610de4a8827510e0d',
        username: 'test4@gmail.com',
        firstname: 'test',
        lastname: 'test',
        __v: 0,
      },
    ],
  };

  const [filter, setFilter] = useRecoilState(userListAtom);
  const [userList, setUserList] = useState([]);

  const handleInputChange = (event) => {
    const text = event.target.value;
    setFilter(text);
  };

  const loadData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/bulk/?filter=${encodeURIComponent(
          filter
        )}`
      );
      console.log(response.data.users);
      setUserList(response.data.users);
      return response.data;
    } catch (error) {
      console.error('Error fetching user list:', error);
      return [];
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  return (
    <>
      <div className="p-4 px-5 md:px-10 flex flex-col items-center">
        <div className="text-xl md:text-2xl font-bold text-black w-full mb-4">
          Users
        </div>
        <div className="w-full md:w-2/3">
          <Input
            type="text"
            id="username"
            placeholder="Search Users"
            className="border-black mt-2 mb-4"
            value={filter}
            onChange={(event) => {
              handleInputChange(event);
            }}
          />
        </div>

        {userList.length > 0 ? (
          userList.map((user) => (
            <div key={user._id} className="w-full md:w-2/3 mb-4">
              <div className="flex items-center justify-between p-2 md:p-4 bg-gray-100 rounded-md">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 md:h-14 md:w-14">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.firstname + ' ' + user.lastname
                      )}`}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 md:ml-4 text-base md:text-xl capitalize">
                    {`${user.firstname} ${user.lastname}`}
                  </div>
                </div>
                <Button className="text-sm md:text-base">
                  Send Money
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </>
  );
};

export default UserDetails;
