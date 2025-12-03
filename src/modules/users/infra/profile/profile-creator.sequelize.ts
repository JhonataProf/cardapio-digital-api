import Cliente from "@/models/cliente-model";
import Funcionario from "@/models/funcionario-model";
import Gerente from "@/models/gerente-model";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { ProfileCreator } from "@/modules/users/domain/profile/profile-creator";

export class SequelizeProfileCreator implements ProfileCreator {
  async createForUser(user: UserEntity, payload: any): Promise<void> {
    switch (user.role) {
      case "Cliente":
        await Cliente.create({
          userId: user.id,
          nome: user.nome,
          telefone: payload.clienteTelefone ?? null,
          endereco: payload.clienteEndereco ?? null,
        });
        break;

      case "Funcionario":
        await Funcionario.create({
          userId: user.id,
          nome: user.nome,
          // outros campos se tiver
        });
        break;

      case "Gerente":
        await Gerente.create({
          userId: user.id,
          nome: user.nome,
          // outros campos se tiver
        });
        break;

      default:
        // se quiser, joga AppError aqui
        break;
    }
  }
}
