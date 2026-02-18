import { PedidoStatusValues } from "@/modules/pedidos/domain/value-objects/pedido-status";
import { z } from "zod";

export const pedidoItemSchema = z.object({
  produtoId: z.number({ error: "O ID do produto é obrigatório." }),
  quantidade: z
    .number({ error: "A quantidade deve ser um número" })
    .min(1, { error: "A quantidade deve ser no mínimo 1" }),
  precoUnitario: z
    .number({ error: "O preço unitário deve ser um número" })
    .min(0, { error: "O preço unitário deve ser no mínimo 0" }),
});

export const updatePedidoSchema = z.object({
  status: z
    .enum(PedidoStatusValues, {
      error:
        "O status deve ser 'Pendente', 'Em Progresso', 'Concluído' ou 'Cancelado'",
    })
    .optional(),
  itens: z.array(pedidoItemSchema).optional(),
});

export const createPedidoSchema = z.object({
  usuarioId: z.number({ error: "O ID do usuário é obrigatório." }),
  clienteTelefone: z.string({ error: "O telefone do cliente é obrigatório." }),
  itens: z
    .array(pedidoItemSchema, {
      error: "Os itens do pedido estão incorretos",
    })
    .min(1, { error: "O pedido deve ter no mínimo 1 item" }),
});
