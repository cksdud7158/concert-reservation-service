import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, headers } = request;
    const userAgent = headers["user-agent"] || "";
    const token = this.extractTokenFromHeader(request);

    // Assuming the user is authenticated and JWT contains user ID
    // const user = request.user;
    // const userId = user ? user.userId : "Anonymous";

    const now = Date.now();

    this.logger.log(
      `request: ${method} ${url} - UserAgent: ${userAgent} - Headers: ${JSON.stringify(headers)} - JWT: ${token}  - Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;
        const { statusCode } = response;
        let logMessage = `Response: ${method} ${url} - StatusCode: ${statusCode} - ResponseTime: ${responseTime}ms`;

        // Log response body only if it's not too large
        if (data && JSON.stringify(data).length < 1000) {
          logMessage += ` - ResponseBody: ${JSON.stringify(data)}`;
        }

        this.logger.log(logMessage);
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        const { status } = response;
        this.logger.error(
          `Error Response: ${method} ${url} - StatusCode: ${status} - ResponseTime: ${responseTime}ms - Error: ${error.message}`,
        );
        throw error;
      }),
    );
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : null;
  }
}
