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
console.log('=============================> database name', isTest ? 'neondb' : process.env.PG_DATABASE)
export const primaryPostgresConnectionOptions: PostgresConnectionOptions = {
    name: "default",
    type: 'postgres',
    host: isTest ? 'ep-twilight-wave-02964973.eu-central-1.aws.neon.tech' : process.env.PG_HOST,
    port: isTest ? 5432 : +process.env.PG_PORT,
    username: isTest ? 'springfield.3298' : process.env.PG_USER,
    password: isTest ? 'VRirOjE9BfN2' : process.env.PG_PASSWORD,
    database: isTest ? 'neondb' : process.env.PG_DATABASE,
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