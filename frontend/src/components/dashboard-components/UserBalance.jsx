import {currentBalanceAtom} from '@/store/atoms/userAtom';
import axios from 'axios';
import {useEffect} from 'react';
import {useRecoilState} from 'recoil';

const UserBalance = () => {
  const [currentBalance, setCurrentBalance] = useRecoilState(
    currentBalanceAtom
  );

  const fetchBalance = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      'http://localhost:3000/api/v1/account/balance',
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setCurrentBalance(response.data);
  };

  useEffect(() => {
    fetchBalance();
  }, [currentBalance]);

  console.log();
  return (
    <div className="text-lg font-bold p-2 md:p-4 px-5 md:px-10 mt-5 text-black flex flex-col md:flex-row justify-between items-center">
      <span>
        Your Balance - &#8377;{currentBalance?.balance ?? 0}
      </span>
    </div>
  );
};

export default UserBalance;
