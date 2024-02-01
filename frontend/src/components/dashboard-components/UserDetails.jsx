import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {Input} from '@/components/ui/input';
import {userListAtom} from '@/store/atoms/userAtom';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';

import MoneyTransfer from './MoneyTransfer';

const UserDetails = () => {
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
        <div className="w-full md:w-2/3">
          <div className="text-xl md:text-2xl font-bold text-black w-full mb-4">
            Users List
          </div>
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
                <MoneyTransfer user={user} />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full md:w-2/3 mt-4">
            <div className="flex items-center justify-center p-2 md:p-4 bg-gray-100 rounded-md">
              No Users Found
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetails;
