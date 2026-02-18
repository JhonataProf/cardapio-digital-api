import { DeletePedidoRepository } from "../../domain/repositories/delete-pedido.repository";

export class DeletePedidoUseCase {
  constructor(private readonly repo: DeletePedidoRepository) {}
  async execute(id: number) {
    const ok = await this.repo.delete(id);
    // if (!ok) throw new Error("Pedido não encontrado");
    return true;
  }
}
