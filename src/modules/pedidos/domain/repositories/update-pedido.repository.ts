export interface UpdatePedidoRepository {
  update(pedidoId: number, data: any): Promise<void>;
}