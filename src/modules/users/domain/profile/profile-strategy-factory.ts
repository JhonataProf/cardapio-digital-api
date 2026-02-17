import { ProfileCreationStrategy } from "./profile-creation-strategy";
import { ClienteProfileStrategy } from "@/modules/users/infra/profile/cliente-profile.strategy";
import { FuncionarioProfileStrategy } from "@/modules/users/infra/profile/funcionario-profile.strategy";
import { GerenteProfileStrategy } from "@/modules/users/infra/profile/gerente-profile.strategy";
import { AppError } from "@/core/errors-app-error";

export type UserRole = "Gerente" | "Funcionario" | "Cliente";

export class ProfileStrategyFactory {
  private readonly strategies: Record<UserRole, ProfileCreationStrategy>;

  constructor() {
    this.strategies = {
      Gerente: new GerenteProfileStrategy(),
      Funcionario: new FuncionarioProfileStrategy(),
      Cliente: new ClienteProfileStrategy(),
    };
  }

  getStrategy(role: UserRole): ProfileCreationStrategy {
    const strategy = this.strategies[role];

    if (!strategy) {
      throw new AppError({
        code: "PROFILE_STRATEGY_NOT_FOUND",
        message: `Nenhuma estratégia de perfil encontrada para role ${role}`,
        statusCode: 400,
      });
    }

    return strategy;
  }
}