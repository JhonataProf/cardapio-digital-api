import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ok, serverError } from "@/core/helpers/http-helper";
import { ListPedidosUseCase } from "../../../application/use-cases/list-pedidos.usecase";
import { SequelizePedidoRepository } from "@/modules/pedidos/infra/sequelize/sequelize-pedido.repository";

export class ListarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoRepo = new SequelizePedidoRepository();
      const pedidoService = new ListPedidosUseCase(pedidoRepo);
      const pedidos = await pedidoService.execute();
      return ok(pedidos);
    } catch (error: any) {
      return serverError(error);
    }
  }
}