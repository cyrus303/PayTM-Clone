import {currentBalanceAtom} from '@/store/atoms/userAtom';
import axios from 'axios';
import {useEffect} from 'react';
import {useRecoilState} from 'recoil';

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
  return response.data;
};

const UserBalance = () => {
  const [currentBalance, setCurrentBalance] = useRecoilState(
    currentBalanceAtom
  );

  useEffect(() => {
    const fetchData = async () => {
      const balanceData = await fetchBalance();
      setCurrentBalance(balanceData);
    };
    fetchData();
  }, []);

  return (
    <div className="text-2xl font-bold p-2 md:p-4 px-5 md:px-10 mt-5 text-black flex flex-col md:flex-row justify-between items-center">
      <span>
        Your Balance - &#8377;{currentBalance?.balance ?? 0}
      </span>
    </div>
  );
};

export default UserBalance;
export {fetchBalance};
