export interface FindPedidoByIdRepository {
  findById(pedidoId: number): Promise<any | null>;
}