import {atom, selector} from 'recoil';
import axios from 'axios';

export const currentUserStateAtom = atom({
  key: 'currentUserStateAtom',
  default: 'User',
});

export const currentUserStateSelector = selector({
  key: 'currentUserStateSelector',
  get: async ({get}) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      'http://localhost:3000/api/v1/user/loggedInUser',
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  },
});

export const currentUserBalanceSelector = selector({
  key: 'currentUserBalanceSelector',
  get: async ({get}) => {
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
  },
});
