import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request } from 'express';
import { UserIdHeaderDto } from '../dto/user-id-header.dto';

export interface RequestUser {
  id: string;
  email?: string;
  roles?: string[];
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as Request & { user?: RequestUser }).user;
  },
);

type RequestWithUser = Request & {
  user?: RequestUser;
  headers: Record<string, unknown>;
};

const getRequestWithUser = (ctx: ExecutionContext): RequestWithUser =>
  ctx.switchToHttp().getRequest<RequestWithUser>();

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = getRequestWithUser(ctx);
    const headersDto = plainToInstance(UserIdHeaderDto, request.headers);

    const errors = validateSync(headersDto);
    if (errors.length) {
      throw new BadRequestException('Missing x-user-id header');
    }

    return request.user?.id ?? headersDto.userId;
  },
);

export const CurrentUserEmail = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = getRequestWithUser(ctx);
    const headerEmail =
      typeof request.headers['x-user-email'] === 'string'
        ? (request.headers['x-user-email'] as string)
        : undefined;
    return request.user?.email ?? headerEmail;
  },
);

export const CurrentUserRoles = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string[] => {
    const request = getRequestWithUser(ctx);
    const headerRoles = Array.isArray(request.headers['x-user-roles'])
      ? (request.headers['x-user-roles'] as string[])
      : typeof request.headers['x-user-roles'] === 'string'
        ? (request.headers['x-user-roles'] as string)
            .split(',')
            .map((role) => role.trim())
            .filter(Boolean)
        : [];
    return request.user?.roles ?? headerRoles ?? [];
  },
);
