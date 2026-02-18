import { ListPedidosRepository } from "../../domain/repositories/list-pedidos.repository";

export class ListPedidosUseCase {
  constructor(private readonly repo: ListPedidosRepository) {}
  async execute() {
    return this.repo.list();
  }
}
