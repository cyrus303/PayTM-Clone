import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {currentUserAtom} from '@/store/atoms/userAtom';
import axios from 'axios';
import {LogOut, User} from 'lucide-react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useRecoilState} from 'recoil';

const Navbar = () => {
  const [currentUser, setCurrentUser] =
    useRecoilState(currentUserAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
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

  const handleProfileChange = () => {
    navigate('/profile');
  };

  useEffect(() => {
    handleTokenRefresh();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between p-4 px-5 md:px-10 border-b-2 border-gray-300 items-center">
      <div className="text-xl md:text-3xl font-bold text-black mb-2 md:mb-0">
        Payments App
      </div>
      <div className="flex justify-between items-center">
        <span className="text-base md:text-xl mr-4 capitalize font-normal">
          Hello, {currentUser.firstname ?? 'User'}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10 md:h-14 md:w-14">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span onClick={handleProfileChange}>Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span onClick={handleLogout}>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
