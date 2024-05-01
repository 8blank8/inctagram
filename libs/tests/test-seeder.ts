import { AspectRatioType, CreatePostDto } from "@files/src/modules/post/dto/create-post.dto";
import { CreateDeviceCommand } from "@inctagram/src/modules/device/use-cases/create/dto/create-device.command";
import { CreateUserCommand } from "@inctagram/src/modules/user/use-cases/create/dto/create-user.command";
import { hashPassword } from "@inctagram/src/utils/hash-password";
import { DeviceEntity } from "@libs/infra/entities/device.entity";
import { PostPhotoEntity } from "@libs/infra/entities/post-photo.enitity";
import { PostEntity } from "@libs/infra/entities/post.entity";
import { UserEntity } from "@libs/infra/entities/user.entity";
import { EntityManager } from "typeorm";

export class CreateUserOptions {
    emailConfirmed?: boolean
    resetPasswordCode?: string
    emailConfirmationCode?: string
}

export class TestSeeder {
    private testCreator: TestCreator
    constructor(private manager: EntityManager) {
        this.testCreator = new TestCreator(this.manager)
    }

    getUserDto(num: number = 1): CreateUserCommand {
        return {
            email: `test${num}@yandex.ru`,
            password: 'password1$',
            username: `username${num}`
        }
    }

    getUserDtos(num: number): CreateUserCommand[] {
        const users: Array<CreateUserCommand> = []

        for (let i = 1; i <= num + 1; i++) {
            users.push(this.getUserDto(i))
        }
        return users
    }

    async createUser(dto: CreateUserCommand, options?: CreateUserOptions): Promise<UserEntity> {
        return this.testCreator.createUser(dto, options)
    }

    async createUsers(dtos: CreateUserCommand[]): Promise<UserEntity[]> {
        const users = []

        dtos.forEach(user => {
            users.push(this.createUser(user))
        });

        return users
    }

    getDeviceDto(num: number = 1, userId: string): CreateDeviceCommand {
        return {
            ip: '1.1.1.1',
            title: `test title for device${num}`,
            userId: userId
        }
    }

    getDevicesDto(num: number, userId: string): CreateDeviceCommand[] {
        const devices: CreateDeviceCommand[] = []

        for (let i = 1; i <= num; i++) {
            devices.push(this.getDeviceDto(i, userId))
        }
        return devices
    }

    async createDevices(devices: CreateDeviceCommand[]): Promise<DeviceEntity[]> {
        const result: DeviceEntity[] = []

        for (let i = 0; i < devices.length; i++) {
            const device = devices[i]

            const d = await this.testCreator.createDevice(device)
            result.push(d)
        }

        return result
    }

    getPostDto(num: number = 1): CreatePostDto {
        return {
            aspectRatio: AspectRatioType.RATIO_16_9,
            offsetX: 1,
            offsetY: 1,
            scale: 1,
            description: `test post description ${num}`,
            location: `nsk ${num}`
        }
    }

    getPostDtos(num: number): CreatePostDto[] {
        const posts: CreatePostDto[] = []

        for (let i = 0; i < num; i++) {
            posts.push(this.getPostDto(i))
        }

        return posts
    }

    async createPosts(dto: CreatePostDto[], user: UserEntity) {
        const posts: PostEntity[] = []

        for (let i = 0; i < dto.length; i++) {
            const postDto = dto[i]
            const post = await this.testCreator.createPost(postDto, user)

            posts.push(post)
        }

        return posts
    }
}

export class TestCreator {
    constructor(private manager: EntityManager) { }

    async createUser(dto: CreateUserCommand, options?: CreateUserOptions) {
        try {
            const user = new UserEntity()
            const { passwordHash, passwordSalt } = await hashPassword(dto.password)

            user.email = dto.email
            user.username = dto.username
            user.emailConfirmed = options?.emailConfirmed ?? true
            user.createdAt = new Date()
            user.passwordHash = passwordHash
            user.passwordSalt = passwordSalt
            user.confirmationCode = options?.emailConfirmationCode ?? null
            user.passwordRecoveryCode = options?.resetPasswordCode ?? null

            return this.manager.save(user)
        } catch (e) {
            console.log(e)
        }
    }

    async createDevice(device: CreateDeviceCommand): Promise<DeviceEntity> {
        try {
            const user = await this.manager.findOneBy(UserEntity, { id: device.userId })
            if (!user) return

            const createdDevice = new DeviceEntity()

            createdDevice.createdAt = new Date()
            createdDevice.updatedAt = new Date()
            createdDevice.title = device.title
            createdDevice.ip = device.ip
            createdDevice.user = user

            await this.manager.save(createdDevice)

            return createdDevice
        } catch (e) {
            console.log(e)
        }
    }

    async createPost(dto: CreatePostDto, user: UserEntity): Promise<PostEntity> {
        try {
            const post = new PostEntity()
            post.createdAt = new Date()
            post.description = dto.description
            post.location = dto.location
            post.user = user

            await this.manager.save(post)

            const photos: PostPhotoEntity[] = []

            for (let i = 0; i < 2; i++) {
                const photo = new PostPhotoEntity()
                photo.aspectRatio = dto.aspectRatio
                photo.createdAt = new Date()
                photo.offsetX = dto.offsetX
                photo.offsetY = dto.offsetY
                photo.scale = dto.scale
                photo.url = `photo/url/${i}`
                photo.post = post

                photos.push(photo)
            }

            await this.manager.save(photos)

            return post
        } catch (e) {
            console.log(e)
        }
    }
}