import { Controller, HttpRequest, HttpResponse } from "@/core/protocols";
import { created, serverError } from "@/core/helpers/http-helper";
import { CreatePedidoUseCase } from "../../../application/use-cases/create-pedido.usecase";
import { CreatePedidoDTO } from "../../../application/dto";
import { SequelizePedidoRepository } from "@/modules/pedidos/infra/sequelize/sequelize-pedido.repository";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";

export class CriarPedidoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pedidoRepo = new SequelizePedidoRepository();
      const userRepo = new SequelizeUserRepository();
      const pedidoService = new CreatePedidoUseCase(userRepo, pedidoRepo);
      const pedidoData: CreatePedidoDTO = httpRequest.body;
      const novoPedido = await pedidoService.execute(pedidoData);
      return created(novoPedido);
    } catch (error: any) {
      return serverError(error);
    }
  }
}