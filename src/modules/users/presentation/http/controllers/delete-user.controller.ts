import { logger } from "@/core/config/logger";
import { resourceOf } from "@/core/helpers/hateoas";
import { serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { DeleteUserUseCase } from "../../../application/use-cases/delete-user.usecase";

export class DeleteUserController implements Controller {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const id = Number(httpRequest.params.id);

      if (Number.isNaN(id)) {
        const resource = resourceOf({
          error: {
            code: "INVALID_ID",
            message: "ID inválido",
          },
        })
          .addLink("list", "GET", "/usuarios")
          .build();

        return {
          statusCode: 400,
          body: resource,
        };
      }

      const deleted = await this.useCase.execute(id);

      if (!deleted) {
        const resource = resourceOf({
          error: {
            code: "USER_NOT_FOUND",
            message: "Usuário não encontrado",
          },
        })
          .addLink("list", "GET", "/usuarios")
          .addLink("create", "POST", "/usuarios")
          .build();

        return {
          statusCode: 404,
          body: resource,
        };
      }

      logger.info("DeleteUserController: usuário deletado", { id });

      // você pode retornar 204 sem body ou 200 com um corpo HATEOAS
      return {
        statusCode: 204,
        body: null,
      };
    } catch (error) {
      logger.error("DeleteUserController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}