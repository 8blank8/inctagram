import { Module } from "@nestjs/common";
import { DeviceContoller } from "./contoller/device.controller";
import { DeviceQueryRepository } from "./repositories/device-query.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceEntity } from "@libs/infra/entities/device.entity";
import { JwtService } from "@nestjs/jwt";


@Module({
    imports: [
        TypeOrmModule.forFeature([DeviceEntity])
    ],
    controllers: [
        DeviceContoller
    ],
    providers: [
        DeviceQueryRepository,
        JwtService
    ]
})
export class DeviceModule { }