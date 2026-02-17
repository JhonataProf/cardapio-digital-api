import {
  ProfileCreationContext,
  ProfileCreationStrategy,
} from "@/modules/users/domain/profile/profile-creation-strategy";
import Cliente from "@/modules/users/infra/model/cliente-model";
import { Transaction } from "sequelize";

export class ClienteProfileStrategy implements ProfileCreationStrategy {
  async removeProfile(userId: number, transaction: Transaction): Promise<void> {
    await Cliente.destroy({ where: { userId }, transaction });
  }
  async createProfile({
    user,
    payload,
    transaction
  }: ProfileCreationContext): Promise<void> {
    await Cliente.create({
      userId: user.id,
      nome: user.nome,
      telefone: payload.clienteTelefone ?? null,
      endereco: payload.clienteEndereco ?? null,
    }, { transaction });
  }
}