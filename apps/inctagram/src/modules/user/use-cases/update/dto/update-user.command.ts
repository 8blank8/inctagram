import { UpdateUserDto } from "../../../dto/input/update-user.dto";

export class UpdateUserCommand extends UpdateUserDto {
    userId: string
}