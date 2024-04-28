import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from 'dotenv'
import { postgresConnectionOptions } from "./postgres-ormconfig";
config()


@Module({
    imports: [
        TypeOrmModule.forRoot(postgresConnectionOptions),
    ]
})
export class PostgresModule { } 