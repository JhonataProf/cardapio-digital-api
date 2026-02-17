import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { created, serverError } from "../../core/helpers/http-helper";
import { PratoService } from "../../service/prato-service";

export class CriarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pratoService = new PratoService();
      const pratoCriado = await pratoService.criarPrato(httpRequest.body);
      return created(pratoCriado);
    } catch (error: any) {
      return serverError(error);
    }
  }
}