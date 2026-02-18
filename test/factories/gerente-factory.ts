// tests/factories/gerente-factory.ts
import Gerente from "@/modules/users/infra/model/gerente-model";
import type User from "@/modules/users/infra/model/user-model";

export async function makeGerente(user: User, attrs?: Partial<Gerente>) {
  return Gerente.create({
    userId: user.id,
    nome: attrs?.nome ?? user.nome,
  } as any);
}
