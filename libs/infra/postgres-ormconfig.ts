import { config } from 'dotenv'
config()
import { DeviceEntity } from './entities/device.entity';
import { UserEntity } from './entities/user.entity';
import { UserAvatarEntity } from './entities/user-avatar.entity'
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { BlackList } from './entities/black-list.entity';
import { PostPhotoEntity } from './entities/post-photo.enitity';
import { PostEntity } from "./entities/post.entity";
import { EmailConfirmationEntity } from './entities/email-confirmation.entity';
import { SubscriptionEntity } from './entities/subscription.entity';

export const allEntities = [
    UserEntity,
    DeviceEntity,
    UserAvatarEntity,
    BlackList,
    PostEntity,
    PostPhotoEntity,
    EmailConfirmationEntity,
    SubscriptionEntity
]

const isTest = process.env.MODE !== 'production';
console.log('=============================> database name', isTest ? 'inctagram_test' : process.env.PG_DATABASE)
export const postgresConnectionOptions: PostgresConnectionOptions = {
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

export default new DataSource(postgresConnectionOptions)