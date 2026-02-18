import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { ok, serverError } from "@/core/helpers/http-helper";
import { UpdatePedidoUseCase } from "../../../application/use-cases/update-pedido.usecase";
import { UpdatePedidoDTO } from "../../../application/dto";
import { SequelizePedidoRepository } from "@/modules/pedidos/infra/sequelize/sequelize-pedido.repository";

export class AtualizarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoRepo = new SequelizePedidoRepository();
      const pedidoService = new UpdatePedidoUseCase(pedidoRepo, pedidoRepo);
      const pedidoData: UpdatePedidoDTO = httpRequest.body;
      const id = httpRequest?.params.id;
      const pedidoAtualizado = await pedidoService.execute(id, pedidoData);
      return ok(pedidoAtualizado);
    } catch (error: any) {
      return serverError(error);
    }
  }
}