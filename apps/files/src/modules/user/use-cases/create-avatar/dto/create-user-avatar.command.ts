import { CreateUserAvatarDto } from "../../../dto/input/create-user-avatar.dto";


export class CreateUserAvatarCommand {
    dto: CreateUserAvatarDto
    file: Express.Multer.File
    userId: string
}