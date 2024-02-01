import {currentUserBalanceSelector} from '@/store/atoms/userAtom';
import {useRecoilValueLoadable} from 'recoil';

const UserBalance = () => {
  const currentBalance = useRecoilValueLoadable(
    currentUserBalanceSelector
  );

  console.log();
  return (
    <div className="text-2xl font-bold p-4 px-10 mt-5 text-black flex w-1/5  justify-between items-center">
      <span>UserBalance</span>
      <span>-</span>
      <span> &#8377;{currentBalance?.contents?.balance ?? 0}</span>
    </div>
  );
};

export default UserBalance;
