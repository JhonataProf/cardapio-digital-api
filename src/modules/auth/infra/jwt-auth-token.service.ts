import jwt from "jsonwebtoken";
import { AuthTokenService } from "@/modules/auth/domain/services/auth-token.service";
import { ENV } from "@/config/env"; // onde estiver seu SECRET

const ACCESS_TOKEN_EXP = "15m";
const REFRESH_TOKEN_EXP = "7d";

export class JwtAuthTokenService implements AuthTokenService {
  constructor(
    private readonly accessSecret = ENV.JWT_ACCESS_SECRET,
    private readonly refreshSecret = ENV.JWT_REFRESH_SECRET ??
      ENV.JWT_ACCESS_SECRET
  ) {}

  generateAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }): string {
    return jwt.sign(
      {
        email: payload.email,
        role: payload.role,
      },
      this.accessSecret,
      {
        subject: payload.sub,
        expiresIn: ACCESS_TOKEN_EXP,
      }
    );
  }

  generateRefreshToken(payload: { sub: string }): string {
    return jwt.sign({}, this.refreshSecret, {
      subject: payload.sub,
      expiresIn: REFRESH_TOKEN_EXP,
    });
  }

  decodeRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.refreshSecret) as jwt.JwtPayload;

      return {
        sub: String(decoded.sub),
        email: decoded.email as string | undefined,
        role: decoded.role as string | undefined,
      };
    } catch {
      return null;
    }
  }
}
