import { CreatePedidoRepository } from "../../domain/repositories/create-pedido.repository";
import { DeletePedidoRepository } from "../../domain/repositories/delete-pedido.repository";
import { FindPedidoByIdRepository } from "../../domain/repositories/find-pedido-by-id.repository";
import { ListPedidosRepository } from "../../domain/repositories/list-pedidos.repository";
import { UpdatePedidoRepository } from "../../domain/repositories/update-pedido.repository";
import Pedido from "../model/pedido-model";
import { Transaction } from "sequelize";

export class SequelizePedidoRepository
  implements
    CreatePedidoRepository,
    FindPedidoByIdRepository,
    ListPedidosRepository,
    UpdatePedidoRepository, 
    DeletePedidoRepository
{
  async delete(pedidoId: number, t?: Transaction): Promise<void> {
    await Pedido.destroy({ where: { id: pedidoId }, transaction: t });
  }
  async create(data: any, transaction?: Transaction): Promise<any> {
    return await Pedido.create(data, { transaction });
  }

  async findById(pedidoId: number): Promise<any | null> {
    return await Pedido.findByPk(pedidoId);
  }

  async list(): Promise<any[]> {
    return await Pedido.findAll();
  }

  async update(pedidoId: number, data: any): Promise<void> {
    await Pedido.update(data, { where: { id: pedidoId } });
  }
}
