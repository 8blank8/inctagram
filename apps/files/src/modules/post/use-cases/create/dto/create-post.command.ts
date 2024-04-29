import { AspectRatioType } from "../../../dto/create-post.dto"

export class CreatePostCommand {
    offsetX: number
    offsetY: number
    scale: number
    aspectRatio: AspectRatioType
    description?: string
    location: string
    files: Array<Express.Multer.File>
    userId: string
}