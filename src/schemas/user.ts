import * as z from "zod";

export const createUserSchema = z.object({
  nome: z
    .string({ error: "O nome de usuario é obrigatório" })
    .min(3, { error: "O nome de usuario deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome de usuario deve ter no máximo 30 caracteres" }),
  email: z.email({ error: "O email está no formato incorreto" }),
  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(6, { error: "A senha deve ter no minimo 6 caracteres" })
    .max(8, { error: "A senha deve ter no máximo 8 caracteres" }),
  telefone: z
    .string()
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" })
    .optional(),
  role: z.enum(["Gerente", "Funcionario", "Cliente"], {
    error: "A role deve ser 'Gerente', 'Funcionario' ou 'Cliente'",
  }),
});

export const updateUserSchema = z.object({
  nome: z
    .string({ error: "O nome de usuario é obrigatório." })
    .min(3, { error: "O nome de usuario deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome de usuario deve ter no máximo 30 caracteres" })
    .optional(),
  senha: z
    .string()
    .min(6, { error: "A senha deve ter no minimo 6 caracteres" })
    .max(8, { error: "A senha deve ter no máximo 8 caracteres" })
    .optional(),
  role: z
    .enum(["Gerente", "Funcionario", "Cliente"], {
      error: "A role deve ser 'Gerente', 'Funcionario' ou 'Cliente'",
    })
    .optional(),
});