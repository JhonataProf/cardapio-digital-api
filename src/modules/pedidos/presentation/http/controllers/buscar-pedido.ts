import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ok, serverError } from "@/core/helpers/http-helper";
import { GetPedidoByIdUseCase } from "../../../application/use-cases/get-pedido-by-id.usecase";
import { SequelizePedidoRepository } from "@/modules/pedidos/infra/sequelize/sequelize-pedido.repository";

export class BuscarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoRepo = new SequelizePedidoRepository();
      const pedidoService = new GetPedidoByIdUseCase(pedidoRepo);
      const pedido = await pedidoService.execute(httpRequest?.params.id);
      return ok(pedido);
    } catch (error: any) {
      return serverError(error);
    }
  }
}