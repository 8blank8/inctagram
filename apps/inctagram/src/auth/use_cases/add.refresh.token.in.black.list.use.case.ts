// import { CommandHandler } from '@nestjs/cqrs';

// export class AddRefreshTokenInBlackListCommand {
//   constructor(
//     public refreshToken: string,
//     public deviceId?: string,
//   ) {}
// }

// @CommandHandler(AddRefreshTokenInBlackListCommand)
// export class AddRefreshTokenInBlackListUseCase {
//   constructor(
//     // private authRepository: AuthRepository,
//     private authRepository: AuthRepositoryTypeorm,
//     private securityRepository: SecurityRepositoryTypeorm, // private securityRepository: SecurityRepository
//   ) {}

//   async execute(command: AddRefreshTokenInBlackListCommand) {
//     const { refreshToken, deviceId } = command;

//     const createdRefreshToken = new BlackListRefreshToken();
//     createdRefreshToken.refreshToken = refreshToken;

//     await this.authRepository.saveToken(createdRefreshToken);

//     if (deviceId) {
//       const isDeleteDevice =
//         await this.securityRepository.deleteDeviceById(deviceId);
//       return isDeleteDevice;
//     }

//     // await this.authRepository.save(token)
//     return true;
//   }
// }
