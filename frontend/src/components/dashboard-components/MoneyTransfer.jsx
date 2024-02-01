import {Input} from '@/components/ui/input';
import {currentBalanceAtom} from '@/store/atoms/userAtom';
import axios from 'axios';
import {useState} from 'react';
import {useRecoilState} from 'recoil';
import {Button} from '../ui/button';
import {Label} from '../ui/label';
import {fetchBalance} from './UserBalance';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MoneyTransfer = ({user}) => {
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [currentBalance, setCurrentBalance] = useRecoilState(
    currentBalanceAtom
  );

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    if (!amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else if (amount <= 0) {
      newErrors.amount = 'Amount must be grater than 1';
      isValid = false;
    } else if (amount >= currentBalance.balance) {
      newErrors.amount = 'Insuffcient funds';
      isValid = false;
    }

    console.log(amount, currentBalance);
    setErrors(newErrors);
    return isValid;
  };

  const initiateTransfer = async () => {
    setErrors({});
    if (validateForm()) {
      const payload = {
        to: user._id,
        amount: +amount,
      };

      try {
        const response = await axios.post(
          'http://localhost:3000/api/v1/account/transfer',
          payload,
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        );
        const balanceData = await fetchBalance();
        setCurrentBalance(balanceData);
        return response.data;
      } catch (error) {
        console.error('Error transfering funds:', error);
        return [];
      }
    }
  };

  const handleMoneyTransfer = () => {
    initiateTransfer();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sm md:text-base">Send Money</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Money Transfer</DialogTitle>
          <DialogDescription>
            Enter amount to be transfered from your account
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-start">
            <Avatar className="md:h-14 md:w-14 ml-5">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.firstname + ' ' + user.lastname
                )}`}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Label
              htmlFor="username"
              className="text-right text-lg ml-7"
            >
              {user.firstname + ' ' + user.lastname}
            </Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="amount" className="text-right text-lg">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              className="col-span-3 text-lg"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              style={errors.amount ? {border: '2px solid red'} : {}}
            />
            {errors.amount && (
              <div className="absolute top-full right-0 text-red-500 text-xs mt-1">
                {errors.amount}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleMoneyTransfer}
          >
            Initiate Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoneyTransfer;
