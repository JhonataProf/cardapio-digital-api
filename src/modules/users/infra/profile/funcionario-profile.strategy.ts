import {
  ProfileCreationStrategy,
  ProfileCreationContext,
} from "@/modules/users/domain/profile/profile-creation-strategy";
import Funcionario from "@/models/funcionario-model";

export class FuncionarioProfileStrategy implements ProfileCreationStrategy {
  async createProfile({
    user,
    payload,
  }: ProfileCreationContext): Promise<void> {
    await Funcionario.create({
      userId: user.id,
      nome: user.nome,
      // coloque aqui os campos que fazem sentido pra funcionário
      // por exemplo: cargo, departamento, etc.
    });
  }
}
