import { ErrorResponseEntity } from '@app/main/auth/entity/error-response.entity';
import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const UnauthorizedApiResponse = ApiResponse({
  description: 'Unauthorized',
  status: HttpStatus.UNAUTHORIZED,
});

export const ErrorApiResponse = ApiResponse({
  type: ErrorResponseEntity,
  status: HttpStatus.BAD_REQUEST,
});

export const NoContentApiResponse = (description = '') =>
  ApiResponse({
    description: description,
    status: HttpStatus.NO_CONTENT,
  });

export const NotFoundApiResponse = (description = '') =>
  ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: description,
  });

export const OkApiResponse = (type: any, description = '') =>
  ApiResponse({
    status: HttpStatus.OK,
    type: type,
    description: description,
  });
