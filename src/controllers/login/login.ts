import { logger } from "@/config/logger";
import { resourceOf } from "@/helpers/hateoas";
import { ok, serverError, unauthorizedResource } from "@/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { LoginService, PerfilResult } from "@/service/login-service";
import { AuthResponseDTO, LoginDTO } from "@/types/login";

export class LoginController implements Controller {
  constructor(private readonly loginService: LoginService) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body as LoginDTO;

      // aqui assumo que o body já foi validado por Zod em middleware
      const userId = await this.loginService.login(body);

      if (!userId) {
        logger.info("LoginController: credenciais inválidas", {
          email: body.email,
        });

        const resource = resourceOf({
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Credenciais inválidas",
          },
        })
          .addLink("self", "POST", "/login")
          .build();

        // agora usamos o helper novo
        return unauthorizedResource(resource);
      }

      const perfil: PerfilResult | null =
        await this.loginService.buscarPerfilPorUserId(userId);

      if (!perfil) {
        logger.warn(
          "LoginController: usuário autenticado sem perfil vinculado",
          { userId }
        );

        const resource = resourceOf({
          error: {
            code: "PROFILE_NOT_FOUND",
            message: "Perfil não encontrado para o usuário",
          },
        })
          .addLink("self", "POST", "/login")
          .build();

        // 500 com HATEOAS, montado manualmente
        return {
          statusCode: 500,
          body: resource,
        };
      }

      const user = perfil.user;

      const { token, refreshToken } = this.loginService.gerarTokens(user);

      // aqui é o "payload de auth", sem o envelope HATEOAS
      const responseData: AuthResponseDTO = {
        token,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          perfil: {
            tipo: perfil.tipo,
            dados: perfil.perfil,
          },
        },
      } as any; // se o schema Zod ainda não estiver igual, depois a gente alinha

      const resource = resourceOf(responseData)
        .addLink("self", "POST", "/login")
        .addLink("refresh-token", "POST", "/refresh-token")
        // rota futura, só manter se fizer sentido no seu domínio
        .addLink("me", "GET", "/usuarios/me")
        .build();

      return ok(resource);
    } catch (error) {
      logger.error("LoginController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      // aqui sim o helper espera um Error
      return serverError(error as Error);
    }
  }
}

export default LoginController;
