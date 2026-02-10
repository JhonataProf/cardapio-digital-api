import { noContent, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { PedidoService } from "../../service/pedido-service";

export class DeletarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoService = new PedidoService();
      const pedidoId = httpRequest.params.id;
      await pedidoService.deletePedido(pedidoId!);
      return noContent();
    } catch (error: any) {
      return serverError(error);
    }
  }
}
