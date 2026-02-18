import { FindUserByIdRepository } from "../../domain/repositories/find-user-by-id.repository";
import { UpdateUserRepository } from "../../domain/repositories/update-user.repository";
import { UserEntity, UserProps } from "../../domain/entities/user.entity";
import { UpdateUserDTO } from "../dto"; // ajuste o nome se necessário
import { Encrypter } from "@/core/interfaces";
import { logger } from "@/core/config/logger";

export class UpdateUserUseCase {
  constructor(
    private readonly findByIdRepo: FindUserByIdRepository,
    private readonly updateUserRepo: UpdateUserRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute(id: number, input: UpdateUserDTO): Promise<UserEntity | null> {
    const existing = await this.findByIdRepo.findById(id);
    if (!existing) {
      logger.info("UpdateUserUseCase: usuário não encontrado", { id });
      return null;
    }

    const dataToUpdate: Partial<UserProps> = {
      nome: input.nome ?? existing.nome,
      email: input.email ?? existing.email,
      role: input.role ?? existing.role,
    };

    if (input.senha) {
      dataToUpdate.senha = await this.encrypter.hash(input.senha);
    }

    const updated = await this.updateUserRepo.update(id, dataToUpdate);

    if (updated) {
      logger.info("UpdateUserUseCase: usuário atualizado", { id });
    }

    return updated;
  }
}