export const PedidoStatusValues = [
  "PENDENTE",
  "PAGO",
  "CANCELADO",
  "CRIADO",
  "ENVIADO",
] as const;
export type PedidoStatus = (typeof PedidoStatusValues)[number];

// “enum-like” (pra usar como PedidoStatusEnum.PENDENTE)
export const PedidoStatusEnum = {
  PENDENTE: "PENDENTE",
  PAGO: "PAGO",
  CANCELADO: "CANCELADO",
  CRIADO: "CRIADO",
  ENVIADO: "ENVIADO",
} as const satisfies Record<string, PedidoStatus>;
