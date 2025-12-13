import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = isHttpException
      ? exception.getResponse()
      : { message: 'Internal server error' };

    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message || 'Unexpected error';
    const details =
      typeof errorResponse === 'object' && errorResponse !== null
        ? (errorResponse as Record<string, unknown>)
        : undefined;

    if (!isHttpException) {
      this.logger.error(
        `Unhandled error for ${request.method} ${request.url}`,
        (exception as Error)?.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      message,
      ...(details && { details }),
    });
  }
}
