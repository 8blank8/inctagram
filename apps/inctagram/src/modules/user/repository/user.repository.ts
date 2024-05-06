import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../../../../../libs/infra/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            where: { email: email },
            relations: { confirmation: true }
        })
    }

    async getUserByUsername(username: string): Promise<UserEntity | null> {
        return this.userRepo.findOneBy({ username: username })
    }

    async getUserById(userId: string): Promise<UserEntity | null> {
        return this.userRepo.findOneBy({ id: userId })
    }

    async getUserByConfirmationCode(code: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            where: {
                confirmation: {
                    confirmationCode: code
                }
            },
            relations: { confirmation: true }
        })
    }

    async getUserByResetPasswordCode(code: string): Promise<UserEntity | null> {
        return this.userRepo.findOneBy({ passwordRecoveryCode: code })
    }

    async getUserWithDevicesById(userId: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            where: { id: userId },
            relations: { devices: true }
        })
    }
}