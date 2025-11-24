import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { CreateUserUseCase } from "../../../application/use-cases/create-user.usecase";
import { created, resource } from "@/shared/http/http-resource";
import { userLinks } from "../user-hateoas";
import { serverError } from "@/helpers/http-helper";
import { CreateUserDTO } from "@/types/usuarios";
import { resourceOf } from "@/helpers/hateoas";
import { logger } from "@/config/logger";

export class CreateUserController implements Controller {
  constructor(private readonly useCase: CreateUserUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      logger.debug("CreateUserController: usuário criado", {
        userId: user.id,
      });

      return created(resourceResp);
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_ALREADY_IN_USE") {
        const resource = resourceOf({
          error: {
            code: "EMAIL_ALREADY_IN_USE",
            message: "Já existe um usuário cadastrado com este email",
          },
        })
          .addLink("self", "POST", "/usuarios")
          .build();

        return {
          statusCode: 409, // Conflict
          body: resource,
        };
      }

      logger.error("CreateUserController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}
