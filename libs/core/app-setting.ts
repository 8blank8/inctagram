import { config } from 'dotenv'
config()

export class AppSetting {
    MODE: string
    PORT: number

    PG_USER_TEST: string
    PG_HOST_TEST: string
    PG_DATABASE_TEST: string
    PG_PASSWORD_TEST: string
    PG_PORT_TEST: number

    PG_USER: string
    PG_PASSWORD: string
    PG_PORT: number
    PG_HOST: string
    PG_DATABASE: string

    MAILER_HOST: string
    MAILER_PORT: number
    MAILER_USER: string
    MAILER_PASS: string

    SALT_ROUNDS: number
    JWT_SECRET: string
    JWT_ACCESS_EXP: string
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXP: string

    FRONT_URL: string
    BACK_URL: string

    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALBACK_URL: string

    FILES_HOST: string
    MAIN_HOST: string

    AWS_S3_ID: string
    AWS_S3_KEY: string
    AWS_S3_BUCKET_NAME: string
    AWS_S3_BASE_URL: string

    constructor() {
        this.MODE = process.env.MODE ?? 'develop'

        this.PORT = +process.env.PORT ?? 3001

        this.PG_USER_TEST = process.env.PG_USER_TEST ?? 'springfield.3298'
        this.PG_HOST_TEST = process.env.PG_HOST_TEST ?? 'ep-twilight-wave-02964973.eu-central-1.aws.neon.tech'
        this.PG_DATABASE_TEST = process.env.PG_DATABASE_TEST ?? 'neondb'
        this.PG_PASSWORD_TEST = process.env.PG_PASSWORD_TEST ?? 'VRirOjE9BfN2'
        this.PG_PORT_TEST = +process.env.PG_PORT_TEST ?? 5432

        this.PG_USER = process.env.PG_USER ?? ''
        this.PG_HOST = process.env.PG_HOST ?? ''
        this.PG_PORT = +process.env.PG_PORT ?? 5432
        this.PG_PASSWORD = process.env.PG_PASSWORD ?? ''
        this.PG_DATABASE = process.env.PG_DATABASE ?? ''

        this.MAILER_HOST = process.env.MAILER_HOST ?? ''
        this.MAILER_PORT = +process.env.MAILER_PORT ?? 465
        this.MAILER_USER = process.env.MAILER_USER ?? ''
        this.MAILER_PASS = process.env.MAILER_PASS ?? ''

        this.SALT_ROUNDS = +process.env.SALT_ROUNDS ?? 10
        this.JWT_SECRET = process.env.JWT_SECRET ?? '123'
        this.JWT_ACCESS_EXP = process.env.JWT_ACCESS_EXP ?? '5m'
        this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? '123'
        this.JWT_REFRESH_EXP = process.env.JWT_REFRESH_EXP ?? '7d'

        this.FRONT_URL = process.env.FRONT_URL ?? ''
        this.BACK_URL = process.env.FRONT_URL ?? `http://localhost:${this.PORT}`

        this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '12302464307-ki4pubgel8l89iduogbpv5ifql8p918a.apps.googleusercontent.com'
        this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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'
        this.GOOGLE_CALBACK_URL = process.env.GOOGLE_CALBACK_URL || `http://localhost:${this.PORT}/api/v1/auth/google-redirect`

        this.FILES_HOST = process.env.FILES_HOST || 'files.localhost'
        this.MAIN_HOST = process.env.MAIN_HOST || 'localhost'

        this.AWS_S3_ID = process.env.AWS_S3_ID || 'YCAJEbSTe3BI6YKWpS9J7yWA4'
        this.AWS_S3_KEY = process.env.AWS_S3_KEY || 'YCPGPzeQsk_nG4GCb7Nb8hTKsH473sd1iw4vPhgB'
        this.AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'incta-back'
        this.AWS_S3_BASE_URL = process.env.AWS_S3_BASE_URL || 'https://storage.yandexcloud.net/incta-back/'
    }
}

export const appSetting = new AppSetting()