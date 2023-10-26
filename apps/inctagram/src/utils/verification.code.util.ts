import { compare, hash } from 'bcrypt';
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
  const code = await hash(dataToCode, settings_env.HASH_ROUNDS);
  console.log('===========>>>>>>>>>>>> ', code);
  return `userId=${payload.id}&code=${code}`;
}

export async function compareVerificationCode(payload: DecodePayload) {
  const result = await compare(payload.email, payload.code);
  console.log('code compare ===========>>>>>>>>>>>> ', result);
  return result;
}
