import { ChangeProfileInfoDto } from '../../dto/change.profile.info.dto';

export class ChangeProfileInfoCommand {
  constructor(
    public userId: string,
    public inputData: ChangeProfileInfoDto,
  ) {}
}
