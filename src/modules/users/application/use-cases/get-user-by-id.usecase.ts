import { FindUserByIdRepository } from "../../domain/repositories/find-user-by-id.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { logger } from "@/core/config/logger";

export class GetUserByIdUseCase {
  constructor(private readonly findByIdRepo: FindUserByIdRepository) {}

  async execute(id: number): Promise<UserEntity | null> {
    const user = await this.findByIdRepo.findById(id);

    if (!user) {
      logger.info("GetUserByIdUseCase: usuário não encontrado", { id });
      return null;
    }

    logger.debug("GetUserByIdUseCase: usuário encontrado", { id });
    return user;
  }
}