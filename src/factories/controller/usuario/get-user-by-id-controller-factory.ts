import { Controller } from "@/core/protocols";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";
import { GetUserByIdUseCase } from "@/modules/users/application/use-cases/get-user-by-id.usecase";
import { GetUserByIdController } from "@/modules/users/presentation/http/controllers/get-user-by-id.controller";

export const GetUserByIdControllerFactory = (): Controller => {
  const userRepo = new SequelizeUserRepository();
  const useCase = new GetUserByIdUseCase(userRepo);
  const controller = new GetUserByIdController(useCase);
  return controller;
};
