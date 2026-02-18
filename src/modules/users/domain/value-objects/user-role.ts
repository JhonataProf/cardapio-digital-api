export const UserRoles = ["Gerente", "Funcionario", "Cliente"] as const;
export type UserRole = (typeof UserRoles)[number];

export const UserRoleEnum = {
  Gerente: "Gerente",
  Funcionario: "Funcionario",
  Cliente: "Cliente",
} as const satisfies Record<string, UserRole>;
