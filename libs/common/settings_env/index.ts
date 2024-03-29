export const settings_env = {
  JWT_SECRET: process.env.JWT_SECRET ?? '123',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? '123456',
  JWT_ACCESS_EXP: process.env.JWT_ACCESS_EXP ?? '5m',
  JWT_REFRESH_EXP: process.env.JWT_REFRESH_EXP ?? '5m',

  HASH_ROUNDS: process.env.HASH_ROUNDS ?? 16,

  AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY ?? '',
  AWS_S3_ACCESS_SECRET: process.env.AWS_S3_ACCESS_SECRET ?? '',
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME ?? '',
  AWS_S3_REGION: process.env.AWS_S3_REGION ?? 'eu-central-1',

  TTL: process.env.TTL ?? 1000,
  LIMIT: process.env.LIMIT ?? 500,

  EMAIL_HOST: process.env.EMAIL_HOST ?? '  ',
  EMAIL_PORT: process.env.EMAIL_PORT ?? '465',
  EMAIL_ID: process.env.EMAIL_ID ?? ' ',
  EMAIL_PASS: process.env.EMAIL_PASS ?? '  ',
  MAIL_TRANSPORT:
    process.env.MAIL_TRANSPORT ??
    'smtps://user@domain.com:pass@smtp.domain.com',
  MAIL_FROM_DEFAULT: 'noreply@incubator-icta-trainee.uk',

  FRONT_URL: process.env.FRONT_URL ?? 'https://incubator-icta-trainee.uk/',
};
