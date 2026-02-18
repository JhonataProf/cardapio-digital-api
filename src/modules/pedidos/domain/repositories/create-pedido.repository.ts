import { Transaction } from "sequelize";

export interface CreatePedidoRepository {
  create(data: any, transaction?: Transaction): Promise<any>;
}
