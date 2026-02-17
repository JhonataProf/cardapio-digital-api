import { Request } from "express";

export type RequestComUsuario = Request & {
  user?: { id?: string; email?: string; role?: string };
};

export * from "./login";
export * from "./pedidos";
export * from "./perfis";
export * from "./pratos";
export * from "./usuarios";