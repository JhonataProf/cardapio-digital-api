import { logger } from "@/core/config/logger";
import { resourceOf } from "@/core/helpers/hateoas";
import { ok, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { GetUserByIdUseCase } from "../../../application/use-cases/get-user-by-id.usecase";

export class GetUserByIdController implements Controller {
  constructor(private readonly useCase: GetUserByIdUseCase) {}

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

      const user = await this.useCase.execute(id);

      if (!user) {
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

      return ok(resource);
    } catch (error) {
      logger.error("GetUserByIdController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}