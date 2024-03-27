import { ErrorResponseEntity } from '@app/main/auth/entity/error-response.entity';
import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const UnauthorizedApiResponse = () =>
  ApiResponse({
    description: 'Unauthorized',
    status: HttpStatus.UNAUTHORIZED,
  });

export const ErrorApiResponse = () =>
  ApiResponse({
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

export const ForbiddenApiResponse = () =>
  ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden.',
  });

export const BadRequestApiResponse = () =>
  ApiResponse({
    type: ErrorResponseEntity,
    status: HttpStatus.BAD_REQUEST,
  });

export const IternalServerErrorApiResponse = () =>
  ApiResponse({
    type: ErrorResponseEntity,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  });

export const OkApiResponse = (type?: any, description = '', isArray = false) =>
  ApiResponse({
    status: HttpStatus.OK,
    type: type,
    description: description,
    isArray: isArray,
  });

export const CreatedApiResponse = (description = '', type?: any) =>
  ApiResponse({
    type: type || null,
    status: HttpStatus.CREATED,
    description: description,
  });
