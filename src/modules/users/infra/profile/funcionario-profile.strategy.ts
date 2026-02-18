import {
  ProfileCreationContext,
  ProfileCreationStrategy,
} from "@/modules/users/domain/profile/profile-creation-strategy";
import Funcionario from "@/modules/users/infra/model/funcionario-model";
import { Transaction } from "sequelize";

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
