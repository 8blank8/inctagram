import { Injectable } from '@nestjs/common';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';

@Injectable()
export class AuthService {
  constructor(private userQueryRepository: UserQueryRepository) {}

  getFullUserData(userId?: string) {
    return this.userQueryRepository.findMe(userId);
  }
  async findUserByEmail(email?: string) {
    const user = await this.userQueryRepository.byUserNameOrEmail(email);
    return user ?? null;
  }
}
