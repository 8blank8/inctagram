import { UpdateUserDto } from "../../../dto/update-user.dto";

export class UpdateUserCommand extends UpdateUserDto {
    userId: string
}