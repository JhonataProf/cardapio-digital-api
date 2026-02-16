import { FindUserByIdRepository } from "../../domain/repositories/find-user-by-id.repository";
import { DeleteUserRepository } from "../../domain/repositories/delete-user.repository";
import { logger } from "@/core/config/logger";

export class DeleteUserUseCase {
  constructor(
    private readonly findByIdRepo: FindUserByIdRepository,
    private readonly deleteUserRepo: DeleteUserRepository
  ) {}

  async execute(id: number): Promise<boolean> {
    const existing = await this.findByIdRepo.findById(id);
    if (!existing) {
      logger.info("DeleteUserUseCase: usuário não encontrado", { id });
      return false;
    }

    const deleted = await this.deleteUserRepo.delete(id);

    logger.info("DeleteUserUseCase: usuário deletado", {
      id,
      deleted,
    });

    return deleted;
  }
}
