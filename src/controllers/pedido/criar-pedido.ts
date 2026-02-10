import { created, serverError } from "@/core/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { PedidoService } from "../../service/pedido-service";
import { CreatePedidoDTO } from "../../types";

export class CriarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoService = new PedidoService();
      const pedidoData: CreatePedidoDTO = httpRequest.body;
      const novoPedido = await pedidoService.createPedido(pedidoData);
      return created(novoPedido);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
