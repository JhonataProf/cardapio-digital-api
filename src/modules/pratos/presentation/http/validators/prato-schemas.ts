import { z } from "zod";

export const createPratoSchema = z.object({
  nome: z
    .string({ error: "O nome do prato é obrigatório." })
    .min(3, { error: "O nome do prato deve ter no mínimo 3 caracteres" })
    .max(50, { error: "O nome do prato deve ter no máximo 50 caracteres" }),
  cozinha: z
    .string({ error: "O tipo de cozinha é obrigatório." })
    .min(3, { error: "O tipo de cozinha deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O tipo de cozinha deve ter no máximo 30 caracteres" }),
  descricao_resumida: z
    .string({ error: "A descrição resumida está incorreta" })
    .min(10, { error: "A descrição resumida deve ter no mínimo 10 caracteres" })
    .max(100, {
      error: "A descrição resumida deve ter no máximo 100 caracteres",
    }),
  descricao_detalhada: z
    .string({ error: "A descrição detalhada está incorreta" })
    .min(20, {
      error: "A descrição detalhada deve ter no mínimo 20 caracteres",
    })
    .max(500, {
      error: "A descrição detalhada deve ter no máximo 500 caracteres",
    }),
  valor: z
    .number({ error: "O preço deve ser um número" })
    .min(0, { error: "O preço deve ser no mínimo 0" }),
  imagem: z
    .url({
      message: "A URL da imagem deve ser uma URL válida",
    })
    .optional(),
});