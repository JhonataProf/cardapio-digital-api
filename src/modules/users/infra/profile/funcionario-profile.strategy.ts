import Funcionario from "@/models/funcionario-model";
import { Transaction } from "sequelize";
import {
  ProfileCreationStrategy,
  ProfileCreationContext,
} from "@/modules/users/domain/profile/profile-creation-strategy";

export class FuncionarioProfileStrategy implements ProfileCreationStrategy {
  async removeProfile(userId: number, transaction: Transaction): Promise<void> {
    await Funcionario.destroy({ where: { userId }, transaction });
  }

  async createProfile({ user, transaction }: ProfileCreationContext): Promise<void> {
    await Funcionario.create(
      { userId: user.id, nome: user.nome },
      { transaction }
    );
  }
}
