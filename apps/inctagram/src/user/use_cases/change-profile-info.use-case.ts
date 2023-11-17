import { CommandHandler } from '@nestjs/cqrs';
import { ChangeProfileInfoDto } from '../dto/change.profile.info.dto';
import { UserQueryRepository } from '../repository/user-query.repository';
import { UserRepository } from '../repository/user.repository';

export class ChangeProfileInfoCommand {
  constructor(
    public userId: string,
    public inputData: ChangeProfileInfoDto,
  ) {}
}

@CommandHandler(ChangeProfileInfoCommand)
export class ChangeProfileInfoUseCase {
  constructor(
    private userQueryRepo: UserQueryRepository,
    private userRepo: UserRepository,
  ) {}

  async execute(command: ChangeProfileInfoCommand): Promise<boolean> {
    const { userId, inputData } = command;

    const user = await this.userQueryRepo.findUserById(userId);
    if (!user) return false;

    const currentDate = new Date().getFullYear();
    const userDate = new Date(inputData.dateOfBirth).getFullYear();
    console.log({ date: currentDate - userDate });
    if (currentDate - userDate <= 13) return false;

    await this.userRepo.changeProfileInfo(user.id, inputData);
    return true;
  }
}
