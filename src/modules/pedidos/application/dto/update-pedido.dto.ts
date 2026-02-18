import { PedidoItemDTO } from "./create-pedido.dto";
import { PedidoStatus } from "../../domain/value-objects/pedido-status"; // depois a gente realoca p/ módulo

export type UpdatePedidoDTO = {
  itens?: PedidoItemDTO[];
  status?: PedidoStatus;
};
