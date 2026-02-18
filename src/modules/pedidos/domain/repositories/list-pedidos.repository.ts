export interface ListPedidosRepository {
  list(): Promise<any[]>;
}