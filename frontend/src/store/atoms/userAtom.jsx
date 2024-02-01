import {atom} from 'recoil';

export const userListAtom = atom({
  key: 'userListAtom',
  default: '',
});

export const currentBalanceAtom = atom({
  key: 'currentBalanceAtom',
  default: '',
});
