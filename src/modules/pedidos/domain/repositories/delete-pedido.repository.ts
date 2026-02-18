import { Transaction } from "sequelize";

export interface DeletePedidoRepository {
  delete(pedidoId: number, t?: Transaction): Promise<void>;
}