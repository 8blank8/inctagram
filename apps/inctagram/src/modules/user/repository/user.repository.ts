import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../../../../../libs/infra/entities/user.entity";
import { MoreThan, Repository } from "typeorm";
import { SubscriptionEntity } from "@libs/infra/entities/subscription.entity";


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(SubscriptionEntity) private subscriptionRepo: Repository<SubscriptionEntity>
    ) { }

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

    async getCurrentUserSubscription(userId: string): Promise<SubscriptionEntity[]> {
        const subscription = await this.subscriptionRepo.find({
            where: {
                expirationDate: MoreThan(new Date()),
                user: {
                    id: userId
                }
            },
            relations: { user: true },
            order: { expirationDate: 'DESC' }
        })

        return subscription
    }
}