import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { noContent, serverError } from "@/core/helpers/http-helper";
import { DeletePedidoUseCase } from "../../../application/use-cases/delete-pedido.usecase";
import { SequelizePedidoRepository } from "@/modules/pedidos/infra/sequelize/sequelize-pedido.repository";

export class DeletarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoRepo = new SequelizePedidoRepository();
      const pedidoService = new DeletePedidoUseCase(pedidoRepo);
      const pedidoId = httpRequest.params.id;
      await pedidoService.execute(pedidoId!);
      return noContent();
    } catch (error: any) {
      return serverError(error);
    }
  }
}