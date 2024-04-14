import { Module } from "@nestjs/common";
import { CreateDeviceUseCase } from "./use-cases/create/create-device.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceEntity } from "./entities/device.entity";
import { DeviceRepository } from "./repository/device.repository";
import { UserModule } from "../user/user.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([DeviceEntity]),
        UserModule
    ],
    providers: [
        CreateDeviceUseCase,
        DeviceRepository
    ],
    exports: [
        DeviceRepository,
        CreateDeviceUseCase,
    ]
})
export class DeviceModule { }