import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LoggingInterceptor } from "@app/presentation/interceptor/logging/logging.interceptor";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingInterceptor.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, url, body, headers } = request;
    const token = this.extractTokenFromHeader(request);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || "Internal server error";

    this.logger.log(
      `url: ${method}-${url} - Headers: ${JSON.stringify(headers)} - JWT: ${token}  - Body: ${JSON.stringify(body)}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : null;
  }
}
