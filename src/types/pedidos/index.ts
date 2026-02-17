import * as z from "zod";
import {
  createPedidoSchema,
  pedidoItemSchema,
  updatePedidoSchema,
} from "../../schemas";

export type PedidoItemDTO = z.infer<typeof pedidoItemSchema>;

export type UpdatePedidoDTO = z.infer<typeof updatePedidoSchema>;

export type CreatePedidoDTO = z.infer<typeof createPedidoSchema>;