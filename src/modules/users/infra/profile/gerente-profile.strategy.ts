import {
  ProfileCreationContext,
  ProfileCreationStrategy,
} from "@/modules/users/domain/profile/profile-creation-strategy";
import Gerente from "@/modules/users/infra/model/gerente-model";
import { Transaction } from "sequelize";

export class GerenteProfileStrategy implements ProfileCreationStrategy {
  async removeProfile(userId: number, transaction: Transaction): Promise<void> {
    await Gerente.destroy({ where: { userId }, transaction });
  }

  async createProfile({ user, transaction }: ProfileCreationContext): Promise<void> {
    await Gerente.create(
      { userId: user.id, nome: user.nome },
      { transaction }
    );
  }
}
