import * as z from "zod";
import {
  createClienteSchema,
  createFuncionarioSchema,
  createGerenteSchema,
  updateClienteSchema,
  updateFuncionarioSchema,
  updateGerenteSchema,
} from "../../schemas";

export type CreateFuncionarioDTO = z.infer<typeof createFuncionarioSchema>;

export type CreateClienteDTO = z.infer<typeof createClienteSchema>;

export type CreateGerenteDTO = z.infer<typeof createGerenteSchema>;

export type UpdateFuncionarioDTO = z.infer<typeof updateFuncionarioSchema>;

export type UpdateClienteDTO = z.infer<typeof updateClienteSchema>;

export type UpdateGerenteDTO = z.infer<typeof updateGerenteSchema>;