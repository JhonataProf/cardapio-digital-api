import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { created, serverError } from "@/core/helpers/http-helper";
import { CreatePratoUseCase } from "../../../application/use-cases/create-prato.usecase";
import { SequelizePratoRepository } from "@/modules/pratos/infra/sequelize/sequelize-prato.repository";

export class CriarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pratoRepo = new SequelizePratoRepository();
      const pratoService = new CreatePratoUseCase(pratoRepo);
      const pratoCriado = await pratoService.execute(httpRequest.body);
      return created(pratoCriado);
    } catch (error: any) {
      return serverError(error);
    }
  }
}