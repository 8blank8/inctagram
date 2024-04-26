import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlackList } from "../entities/black-list.entity";
import { Repository } from "typeorm";


@Injectable()
export class TokenRepository {
    constructor(@InjectRepository(BlackList) private tokenRepo: Repository<BlackList>) { }

    async getTokenByToken(refreshToken: string): Promise<BlackList | null> {
        return this.tokenRepo.findOneBy({ token: refreshToken })
    }
}