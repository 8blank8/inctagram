import { randomBytes, scryptSync } from 'crypto';
import { settings_env } from '@app/common';
import * as dayjs from 'dayjs';
import * as CryptoJS from 'crypto-js';

const CRYPT_KEY = 'secret_encrypt_key';

interface CodePayload {
  id: string;
  email: string;
}
interface DecodePayload extends CodePayload {
  expiration_time: string;
}

export async function getVerificationCode(payload: CodePayload) {
  const dataToCode = JSON.stringify({
    ...payload,
    expiration_time: dayjs().add(2, 'day').format(),
  });
  console.log('dataToCode => ', dataToCode);
  const code = CryptoJS.AES.encrypt(dataToCode, CRYPT_KEY).toString();
  return `code=${code}`;
}

export async function encryptVerificationCode(
  code: string,
): Promise<DecodePayload> {
  const normalised = code.replace(/ /g, '+');
  const str = CryptoJS.AES.decrypt(normalised, CRYPT_KEY).toString(
    CryptoJS.enc.Utf8,
  );
  const decryptedData = JSON.parse(str);
  if (dayjs().isAfter(dayjs(decryptedData.expiration_time))) {
    throw new Error('Email code has expired');
  }
  return decryptedData;
}

// Pass the password string and get hashed password back
// ( and store only the hashed string in your database)
const encryptPassword = (password: string, salt: string) => {
  const keylen = +settings_env.HASH_ROUNDS * 2;
  return scryptSync(password, salt, keylen).toString('hex');
};

export const hashPassword = (password: string): string => {
  // Any random string here (ideally should be at least 16 bytes)
  const salt = randomBytes(+settings_env.HASH_ROUNDS).toString('hex');
  return encryptPassword(password, salt) + salt;
};

export const matchPassword = (password: string, hash: string): boolean => {
  // extract salt from the hashed string
  // our hex password length is 32*2 = 64
  const keylen = +settings_env.HASH_ROUNDS * 4;
  const salt = hash.slice(keylen);
  const originalPassHash = hash.slice(0, keylen);
  const currentPassHash = encryptPassword(password, salt);
  return originalPassHash === currentPassHash;
};
