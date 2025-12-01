import {
  ProfileCreationStrategy,
  ProfileCreationContext,
} from "@/modules/users/domain/profile/profile-creation-strategy";
import Gerente from "@/models/gerente-model";

export class GerenteProfileStrategy implements ProfileCreationStrategy {
  async createProfile({
    user,
    payload,
  }: ProfileCreationContext): Promise<void> {
    await Gerente.create({
      userId: user.id,
      nome: user.nome,
      // campos específicos de gerente, se existirem
    });
  }
}
