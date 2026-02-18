import { logger } from "@/core/config/logger";
import { ok, serverError } from "@/core/helpers/http-helper";
import { collection } from "@/core/http/http-resource";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ListUsersUseCase } from "../../../application/use-cases/list-users.usecase";
import { userLinks, usersCollectionLinks } from "../user-hateoas";

export class ListUsersController implements Controller {
  constructor(private readonly useCase: ListUsersUseCase) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const users = await this.useCase.execute();

      const data = users.map((user) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        links: userLinks(user.id), // HATEOAS por item
      }));

      const body = collection(data, usersCollectionLinks(), {
        count: data.length,
      });

      logger.debug("ListUsersController: usuários listados", {
        total: data.length,
      });

      return ok(body);
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