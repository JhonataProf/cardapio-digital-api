import * as z from "zod";
import {
  createPedidoSchema,
  pedidoItemSchema,
  updatePedidoSchema,
} from "../../presentation/http/validators/pedido-schemas";

export type PedidoItemDTO = z.infer<typeof pedidoItemSchema>;

export type UpdatePedidoDTO = z.infer<typeof updatePedidoSchema>;

export type CreatePedidoDTO = z.infer<typeof createPedidoSchema>;