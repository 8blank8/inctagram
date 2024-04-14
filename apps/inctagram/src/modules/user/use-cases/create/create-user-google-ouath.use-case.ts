import { Injectable } from "@nestjs/common";
import { CreateUserGoogleOauthCommand } from "./dto/create-user-google-ouath.command";
import { Result } from "@libs/core/result";
import { DataSource, EntityManager } from "typeorm";
import { UserRepository } from "../../repository/user.repository";
import { CreateDeviceUseCase } from "../../../device/use-cases/create/create-device.use-case";
import { createJwtTokens } from "../../../../utils/create-tokens";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../../entities/user.entity";
import { generateUniqueUsername } from "../../../../utils/generate-random-username";
import { TransactionDecorator } from "@inctagram/src/infra/inside-transaction";


@Injectable()
export class CreateUserGoogleOauthUseCase {
    constructor(
        private dataSource: DataSource,
        private userRepo: UserRepository,
        private createDeviceUseCase: CreateDeviceUseCase,
        private jwtService: JwtService
    ) { }

    async execute(command: CreateUserGoogleOauthCommand): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        const transaction = new TransactionDecorator(this.dataSource)

        return transaction.doOperation(
            command,
            this.doOperation.bind(this)
        )
    }

    async doOperation(
        { email, firstname, lastname, userAgent }: CreateUserGoogleOauthCommand,
        manager: EntityManager
    ): Promise<Result<{ accessToken: string, refreshToken: string }>> {
        let user: UserEntity;

        user = await this.userRepo.getUserByEmail(email)

        if (!user) {
            user = new UserEntity()

            user.emailConfirmed = true
            user.email = email
            user.createdAt = new Date()
            user.firstname = firstname
            user.lastname = lastname

            let username: string
            do {
                username = generateUniqueUsername()
                console.log(1)
            }
            while (!!(await this.userRepo.getUserByUsername(username)))

            user.username = username
        }


        const device = await this.createDeviceUseCase.execute({
            title: userAgent,
            userId: user.id
        })
        if (!device.isSuccess) return Result.Err(device.err)

        if (user.devices) {
            user.devices.push(device.value)
        } else {
            user.devices = [device.value]
        }

        await manager.save(user)

        const { accessToken, refreshToken } = await createJwtTokens(this.jwtService, user.id, device.value.id)

        return Result.Ok({ accessToken, refreshToken })
    }
}