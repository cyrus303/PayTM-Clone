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
import {currentUserStateSelector} from '@/store/atoms/userAtom';
import {useRecoilValueLoadable} from 'recoil';

import {LogOut, User} from 'lucide-react';

import {useNavigate} from 'react-router-dom';

const Navbar = () => {
  const currentUser = useRecoilValueLoadable(
    currentUserStateSelector
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="flex justify-between p-4 px-10 border-b-2 border-grey-500 items-center ">
      <div className="text-3xl font-bold  text-black">
        Payments App
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xl mr-4 capitalize font-normal">
          Hello, {currentUser?.contents?.firstname ?? 'User'}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-14 w-14">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
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
