import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { serverError } from "@/helpers/http-helper";
import { CreateUserDTO } from "@/types/usuarios";
import { resourceOf } from "@/helpers/hateoas";
import { logger } from "@/config/logger";
import { CreateUserUseCase } from "../../../application/use-cases/create-user.usecase";

export class CreateUserController implements Controller {
  constructor(private readonly useCase: CreateUserUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body as CreateUserDTO;

      const user = await this.useCase.execute(body);

      const resource = resourceOf({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      })
        .addLink("self", "GET", `/usuarios/${user.id}`)
        .addLink("update", "PUT", `/usuarios/${user.id}`)
        .addLink("delete", "DELETE", `/usuarios/${user.id}`)
        .build();

      logger.debug("CreateUserController: usuário criado", {
        userId: user.id,
      });

      return {
        statusCode: 201,
        body: resource,
      };
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
