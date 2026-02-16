import { Controller } from "@/core/protocols";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";
import { ListUsersUseCase } from "@/modules/users/application/use-cases/list-users.usecase";
import { ListUsersController } from "@/modules/users/presentation/http/controllers/list-users.controller";

export const ListUsersControllerFactory = (): Controller => {
  const userRepo = new SequelizeUserRepository();
  const useCase = new ListUsersUseCase(userRepo);
  const controller = new ListUsersController(useCase);
  return controller;
};
