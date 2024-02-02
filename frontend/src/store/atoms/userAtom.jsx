import {atom} from 'recoil';

export const userListAtom = atom({
  key: 'userListAtom',
  default: '',
});

export const currentBalanceAtom = atom({
  key: 'currentBalanceAtom',
  default: '',
});

export const currentUserAtom = atom({
  key: 'currentUserAtom',
  default: '',
});
