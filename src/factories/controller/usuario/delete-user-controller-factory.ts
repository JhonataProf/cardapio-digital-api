import { Controller } from "@/protocols";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";
import { DeleteUserUseCase } from "@/modules/users/application/use-cases/delete-user.usecase";
import { DeleteUserController } from "@/modules/users/presentation/http/controllers/delete-user.controller";

export const DeleteUserControllerFactory = (): Controller => {
  const userRepo = new SequelizeUserRepository();
  const useCase = new DeleteUserUseCase(userRepo, userRepo);
  const controller = new DeleteUserController(useCase);
  return controller;
};
