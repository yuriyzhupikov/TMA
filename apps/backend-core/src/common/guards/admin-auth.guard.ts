import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestUser } from '../decorators/current-user.decorator';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, unknown>; user?: RequestUser }>();
    const headerUserId =
      typeof request.headers['x-user-id'] === 'string'
        ? (request.headers['x-user-id'] as string)
        : undefined;

    const user: RequestUser = {
      id: headerUserId ?? '',
      email:
        (request.headers['x-user-email'] as string | undefined) ?? undefined,
      roles:
        (request.headers['x-user-roles'] as string | undefined)
          ?.split(',')
          .map((role) => role.trim())
          .filter(Boolean) ?? [],
    };

    request.user = user;
    return true;
  }
}
