import { ok, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { PedidoService } from "../../service/pedido-service";

export class ListarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoService = new PedidoService();
      const pedidos = await pedidoService.getPedidos();
      return ok(pedidos);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
