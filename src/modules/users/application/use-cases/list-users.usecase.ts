import { ListUsersRepository } from "../../domain/repositories/list-users.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { logger } from "@/core/config/logger";

export class ListUsersUseCase {
  constructor(private readonly listUsersRepo: ListUsersRepository) {}

  async execute(): Promise<UserEntity[]> {
    const users = await this.listUsersRepo.findAll();
    logger.debug("ListUsersUseCase: usuários listados", {
      total: users.length,
    });
    return users;
  }
}