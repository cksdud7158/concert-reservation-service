import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import key from "@app/config/token/key";
import { TokenService } from "@app/domain/service/token/token.service";
import { PayloadType } from "@app/domain/type/token/payload.type";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject() private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // 토큰 없으면 에러 처리
    if (!token) {
      throw new UnauthorizedException();
    }

    // 토큰 검증
    const payload: PayloadType = await this.jwtService.verifyAsync(token, {
      secret: key,
    });

    // 내 상태 조회
    await this.tokenService.isAvailable(payload.sub);

    request["user"] = payload;
    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : null;
  }
}
