export type PedidoItemDTO = {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
};

export type CreatePedidoDTO = {
  clienteTelefone: string;
  clienteEndereco?: string;
  itens: PedidoItemDTO[];
};
