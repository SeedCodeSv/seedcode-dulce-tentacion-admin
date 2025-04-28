import CryptoJS from 'crypto-js';

import { CRP } from '../utils/constants';

export const encryptData = (data: unknown): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), CRP).toString();
};

export const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRP);

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
