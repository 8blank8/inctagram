export const settings_env = {
  JWT_SECRET: process.env.JWT_SECRET ?? '123',
  JWT_ACCESS_EXP: process.env.JWT_ACCESS_EXP ?? '5m',
  JWT_REFRESH_EXP: process.env.JWT_REFRESH_EXP ?? '5m',

  HASH_ROUNDS: process.env.HASH_ROUNDS ?? 22,

  TTL: process.env.TTL ?? 1000,
  LIMIT: process.env.LIMIT ?? 500,

  EMAIL: process.env.EMAIL ?? ' ',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ?? '  ',
};
