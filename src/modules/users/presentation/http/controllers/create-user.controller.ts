import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreateUserUseCase } from "../../../application/use-cases/create-user.usecase";
import { created, resource } from "@/core/http/http-resource";
import { userLinks } from "../user-hateoas";
import { CreateUserDTO } from "../../../application/dto";
import { logger } from "@/core/config/logger";
import { mapErrorToHttpResponse } from "@/core/http/http-error-response";

export class CreateUserController implements Controller {
  constructor(private readonly useCase: CreateUserUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const correlationId = httpRequest.correlationId;

    logger.info("Iniciando criação de usuário", {
      correlationId,
      route: "CreateUserController",
      body: httpRequest.body,
    });
    try {
      const body = httpRequest.body as CreateUserDTO;

      const user = await this.useCase.execute(body);

      const resourceResp = resource(
        {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
        },
        userLinks(user.id),
        {
          version: "1.0.0",
        }
      );

      logger.info("Usuário criado com sucesso", {
        correlationId,
        route: "CreateUserController",
        userId: user.id,
        email: user.email,
      });

      return created(resourceResp);
    } catch (error) {
      logger.error("Erro ao criar usuário", {
        correlationId,
        route: "CreateUserController",
        error,
      });

      return mapErrorToHttpResponse(error, correlationId);
    }
  }
}