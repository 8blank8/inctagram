import { randomBytes, scryptSync } from 'crypto';
import { settings_env } from '@app/common';

interface CodePayload {
  id: string;
  email: string;
}
interface DecodePayload extends CodePayload {
  code: string;
}
export async function getVerificationCode(payload: CodePayload) {
  const dataToCode = payload.email;

  const code = hashPassword(dataToCode);
  return `userId=${payload.id}&code=${code}`;
}

export async function compareVerificationCode(payload: DecodePayload) {
  const result = matchPassword(payload.email, payload.code);
  console.log('code compare ===========>>>>>>>>>>>> ', result);
  return result;
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
