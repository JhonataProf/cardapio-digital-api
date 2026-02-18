import { logger } from "@/core/config/logger";
import { resourceOf } from "@/core/helpers/hateoas";
import { ok, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { UpdateUserDTO } from "@/modules/users/application/dto";
import { UpdateUserUseCase } from "../../../application/use-cases/update-user.usecase";

export class UpdateUserController implements Controller {
  constructor(private readonly useCase: UpdateUserUseCase) {}

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

      const body = httpRequest.body as UpdateUserDTO;

      const updated = await this.useCase.execute(id, body);

      if (!updated) {
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
        id: updated.id,
        nome: updated.nome,
        email: updated.email,
        role: updated.role,
      })
        .addLink("self", "GET", `/usuarios/${updated.id}`)
        .addLink("delete", "DELETE", `/usuarios/${updated.id}`)
        .build();

      logger.info("UpdateUserController: usuário atualizado", {
        userId: updated.id,
      });

      return ok(resource);
    } catch (error) {
      logger.error("UpdateUserController: erro inesperado", {
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error,
      });

      return serverError(error as Error);
    }
  }
}