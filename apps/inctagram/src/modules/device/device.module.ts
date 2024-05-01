import { Module } from "@nestjs/common";
import { CreateDeviceUseCase } from "./use-cases/create/create-device.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceEntity } from "../../../../../libs/infra/entities/device.entity";
import { DeviceRepository } from "./repository/device.repository";
import { UserModule } from "../user/user.module";
import { DeviceQueryRepository } from "../../../../read/src/modules/device/repositories/device-query.repository";
import { DeviceContoller } from "./contoller/device.controller";
import { JwtService } from "@nestjs/jwt";
import { DeleteDeviceUseCase } from "./use-cases/delete/delete-device.use-case";
import { DeleteDevicesUseCase } from "./use-cases/delete/delete-devices.use-case";


@Module({
    imports: [
        TypeOrmModule.forFeature([DeviceEntity]),
        UserModule
    ],
    controllers: [DeviceContoller],
    providers: [
        CreateDeviceUseCase,
        DeviceRepository,
        DeviceQueryRepository,
        JwtService,
        DeleteDeviceUseCase,
        DeleteDevicesUseCase
    ],
    exports: [
        DeviceRepository,
        CreateDeviceUseCase,
    ]
})
export class DeviceModule { }