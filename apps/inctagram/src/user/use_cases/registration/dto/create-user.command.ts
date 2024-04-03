import { CreateUserDto } from '@app/main/user/dto/create.user.dto';

export class CreateUserCommand {
  user: CreateUserDto;
  sendMail: boolean = false;
}
