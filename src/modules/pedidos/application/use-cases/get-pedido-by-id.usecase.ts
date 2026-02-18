import { FindPedidoByIdRepository } from "../../domain/repositories/find-pedido-by-id.repository";

export class GetPedidoByIdUseCase {
  constructor(private readonly repo: FindPedidoByIdRepository) {}
  async execute(id: number) {
    const pedido = await this.repo.findById(id);
    if (!pedido) throw new Error("Pedido não encontrado");
    return pedido;
  }
}
