import { AuthTokenService } from "@/modules/auth/domain/services/auth-token.service";
import { invalidRefreshToken } from "@/modules/auth/domain/errors/auth-errors";
import { DomainLogger, NoopDomainLogger } from "@/shared/logger/domain-logger";

interface RefreshTokenOutput {
  accessToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly logger: DomainLogger = new NoopDomainLogger()
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenOutput> {
    this.logger.info("Iniciando RefreshTokenUseCase");

    const decoded = this.tokenService.decodeRefreshToken(refreshToken);

    if (!decoded || !decoded.sub) {
      this.logger.error("Refresh token inválido ou sem sub");
      throw invalidRefreshToken();
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: decoded.sub,
      email: decoded.email ?? "",
      role: decoded.role ?? "",
    });

    this.logger.info("Novo access token gerado via refresh", {
      userId: decoded.sub,
    });

    return { accessToken };
  }
}
