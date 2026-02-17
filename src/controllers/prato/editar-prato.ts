import { notFound, ok, serverError } from "../../helpers/http-helper";
import Prato from "../../models/prato-model";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { CreatePratoDTO } from "../../types";

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

      await prato.save(httpRequest.body);

      return ok(prato);
    } catch (error: any) {
      return serverError(error);
    }
  }
}