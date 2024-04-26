import { config } from 'dotenv'
config()
import { DeviceEntity } from '../../apps/inctagram/src/modules/device/entities/device.entity';
import { UserEntity } from '../../apps/inctagram/src/modules/user/entities/user.entity';
import { UserAvatarEntity } from '../../apps/files/src/modules/user/entities/user-avatar.entity'
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { BlackList } from '../../apps/inctagram/src/modules/auth/entities/black-list.entity';

export const allEntities = [
    UserEntity,
    DeviceEntity,
    UserAvatarEntity,
    BlackList
]

const isTest = process.env.MODE !== 'production';
console.log('=============================> database name', isTest ? 'inctagram_test' : process.env.PG_DATABASE)
export const primaryPostgresConnectionOptions: PostgresConnectionOptions = {
    name: "default",
    type: 'postgres',
    host: isTest ? 'localhost' : process.env.PG_HOST,
    port: isTest ? 5432 : +process.env.PG_PORT,
    username: isTest ? 'blank' : process.env.PG_USER,
    password: isTest ? 'blank' : process.env.PG_PASSWORD,
    database: isTest ? 'inctagram_test' : process.env.PG_DATABASE,
    entities: allEntities,
    synchronize: false,
    logging: false,
    extra: {
        max: 50,
        connectionTimeoutMillis: 10000
    },
    ssl: isTest ? null : {
        rejectUnauthorized: true,
    },
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default new DataSource(primaryPostgresConnectionOptions)