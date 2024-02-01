import {currentUserBalanceSelector} from '@/store/atoms/userAtom';
import {useRecoilValueLoadable} from 'recoil';

const UserBalance = () => {
  const currentBalance = useRecoilValueLoadable(
    currentUserBalanceSelector
  );

  console.log();
  return (
    <div className="text-lg font-bold p-2 md:p-4 px-5 md:px-10 mt-5 text-black flex flex-col md:flex-row justify-between items-center">
      <span>
        Your Balance - &#8377;{currentBalance?.contents?.balance ?? 0}
      </span>
    </div>
  );
};

export default UserBalance;
