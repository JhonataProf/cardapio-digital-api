import { notFound, ok, serverError } from "../../helpers/http-helper";
import Prato from "../../models/prato-model";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";

export default class DeletarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const prato = await Prato.findByPk(id);

      if (!prato) {
        return notFound({ error: "Prato não encontrado" });
      }

      await prato.destroy();

      return ok({ message: "Prato deletado com sucesso" });
    } catch (error: any) {
      return serverError(error);
    }
  }
}