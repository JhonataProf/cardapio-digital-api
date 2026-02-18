import { notFound, ok, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import Prato from "@/modules/pratos/infra/model/prato-model";
import { CreatePratoDTO } from "../../../application/dto";

export default class EditarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const {
        nome,
        cozinha,
        descricao_resumida,
        descricao_detalhada,
        imagem,
        valor,
      }: CreatePratoDTO = httpRequest.body;

      const prato = await Prato.findByPk(id);

      if (!prato) {
        return notFound({ error: "Prato não encontrado" });
      }

      await prato.update(httpRequest.body);

      return ok(prato);
    } catch (error: any) {
      return serverError(error);
    }
  }
}