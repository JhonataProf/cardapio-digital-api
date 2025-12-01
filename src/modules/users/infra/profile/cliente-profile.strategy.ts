import {
  ProfileCreationStrategy,
  ProfileCreationContext,
} from "@/modules/users/domain/profile/profile-creation-strategy";
import Cliente from "@/models/cliente-model";

export class ClienteProfileStrategy implements ProfileCreationStrategy {
  async createProfile({
    user,
    payload,
  }: ProfileCreationContext): Promise<void> {
    await Cliente.create({
      userId: user.id,
      nome: user.nome,
      telefone: payload.clienteTelefone ?? null,
      endereco: payload.clienteEndereco ?? null,
    });
  }
}
