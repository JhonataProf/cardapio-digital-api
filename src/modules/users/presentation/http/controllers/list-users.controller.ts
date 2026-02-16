import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ok, serverError } from "@/core/helpers/http-helper";
import { ListUsersUseCase } from "../../../application/use-cases/list-users.usecase";
import { resourceOf } from "@/core/helpers/hateoas";
import { logger } from "@/core/config/logger";

export class ListUsersController implements Controller {
  constructor(private readonly useCase: ListUsersUseCase) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const users = await this.useCase.execute();

      const resource = resourceOf(
        users.map((u) => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          role: u.role,
        }))
      )
        .addLink("self", "GET", "/usuarios")
        .addLink("create", "POST", "/usuarios")
        .build();

      logger.debug("ListUsersController: usuários listados", {
        total: users.length,
      });

      return ok(resource);
    } catch (error) {
      logger.error("ListUsersController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}
