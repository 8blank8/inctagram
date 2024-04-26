import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { BlackList } from "../entities/black-list.entity";


@Injectable()
export class TokenService {
    constructor() { }

    async createExpriredTokenAndSave(refreshToken: string, manager: EntityManager) {
        const expiredToken = new BlackList()
        expiredToken.token = refreshToken
        expiredToken.createdAt = new Date()

        return manager.save(expiredToken)
    }
}