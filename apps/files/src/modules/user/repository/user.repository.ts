import { UserEntity } from "@libs/infra/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) { }

    async getUserById(userId: string): Promise<UserEntity | null> {
        return this.userRepo.findOne({
            where: { id: userId },
            relations: { avatar: true }
        })
    }
}