import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { Result } from "libs/core/result";


@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    async getUserByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepo.findOneBy({ email: email })
    }

    async getUserByUsername(username: string): Promise<UserEntity | null> {
        return this.userRepo.findOneBy({ username: username })
    }

    async getUserById(userId: string): Promise<UserEntity | null> {
        return this.userRepo.findOneBy({ id: userId })
    }

    async getUserByConfirmationCode(code: string): Promise<UserEntity | null> {
        return this.userRepo.findOneBy({ confirmationCode: code })
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