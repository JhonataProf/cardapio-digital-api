import { logger } from "@/core/config/logger";
import { resourceOf } from "@/helpers/hateoas";
import {
  badRequestResource,
  ok,
  serverError,
  unauthorizedResource,
} from "@/helpers/http-helper";
import { Tokenizer } from "@/core/interfaces";
import User from "@/models/user-model";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { AuthResponseDTO, RefreshTokenDTO } from "@/types/login";

export class RefreshTokenController implements Controller {
  constructor(private readonly tokenizer: Tokenizer) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body as RefreshTokenDTO;

      if (!body?.refreshToken) {
        const resource = resourceOf({
          error: {
            code: "REFRESH_TOKEN_REQUIRED",
            message: "Refresh token é obrigatório",
          },
        })
          .addLink("login", "POST", "/login")
          .build();

        return badRequestResource(resource);
      }

      const payload = this.tokenizer.verifyRefreshToken(body.refreshToken);

      if (!payload || !payload.id) {
        const resource = resourceOf({
          error: {
            code: "INVALID_REFRESH_TOKEN",
            message: "Refresh token inválido",
          },
        })
          .addLink("login", "POST", "/login")
          .build();

        return unauthorizedResource(resource);
      }

      const user = await User.findByPk(payload.id);

      if (!user) {
        const resource = resourceOf({
          error: {
            code: "USER_NOT_FOUND",
            message: "Usuário não encontrado",
          },
        })
          .addLink("login", "POST", "/login")
          .build();

        return unauthorizedResource(resource);
      }

      // aqui você pode optar por reutilizar o refreshToken antigo ou gerar um novo
      const token = this.tokenizer.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const responseData: AuthResponseDTO = {
        token,
        refreshToken: body.refreshToken, // ou um novo refreshToken se preferir
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      } as any;

      const resource = resourceOf(responseData)
        .addLink("self", "POST", "/refresh-token")
        .addLink("login", "POST", "/login")
        .build();

      return ok(resource);
    } catch (error) {
      logger.error("RefreshTokenController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}

export default RefreshTokenController;