import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ok, serverError } from "../../core/helpers/http-helper";
import { PedidoService } from "../../service/pedido-service";
import { UpdatePedidoDTO } from "../../types";

export class AtualizarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoService = new PedidoService();
      const pedidoData: UpdatePedidoDTO = httpRequest.body;
      const id = httpRequest?.params.id;
      const pedidoAtualizado = await pedidoService.updatePedido(id, pedidoData);
      return ok(pedidoAtualizado);
    } catch (error: any) {
      return serverError(error);
    }
  }
}