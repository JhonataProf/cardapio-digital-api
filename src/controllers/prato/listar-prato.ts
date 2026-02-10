import { notFound, ok, serverError } from "@/core/helpers/http-helper";
import Prato from "../../models/prato-model";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";

export default class ListarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pratoId = httpRequest.params.id;
      const prato = await Prato.findByPk(pratoId);
      if (!prato && pratoId !== "{id}" && pratoId !== undefined) {
        return notFound({ error: "Prato não encontrado" });
      } else if (pratoId !== "{id}" && pratoId !== undefined) {
        return ok(prato);
      }
      const pratos = await Prato.findAll();
      return ok(pratos);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
