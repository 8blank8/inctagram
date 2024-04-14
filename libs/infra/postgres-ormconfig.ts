import { config } from 'dotenv'
config()
import { DeviceEntity } from '../../apps/inctagram/src/modules/device/entities/device.entity';
import { UserEntity } from '../../apps/inctagram/src/modules/user/entities/user.entity';
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const allEntities = [
    UserEntity,
    DeviceEntity
]

const isTest = process.env.MODE === 'develop';
console.log('=============================> database name', process.env[isTest ? 'PG_DATABASE_TEST' : 'PG_DATABASE'])
export const primaryPostgresConnectionOptions: PostgresConnectionOptions = {
    name: "default",
    type: 'postgres',
    host: process.env[isTest ? 'PG_HOST_TEST' : 'PG_HOST'
    ],
    port: +process.env[isTest ? 'PG_PORT_TEST' : 'PG_PORT'
    ],
    username: process.env[isTest ? 'PG_USER_TEST' : 'PG_USER'
    ],
    password: process.env[isTest ? 'PG_PASSWORD_TEST' : 'PG_PASSWORD'
    ],
    database: process.env[isTest ? 'PG_DATABASE_TEST' : 'PG_DATABASE'
    ],
    entities: allEntities,
    synchronize: false,
    logging: false,
    extra: {
        max: 50,
        connectionTimeoutMillis: 10000
    },
    ssl: {
        rejectUnauthorized: true,
    },
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default new DataSource(primaryPostgresConnectionOptions)