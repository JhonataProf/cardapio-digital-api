import { Controller } from "@/core/protocols";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/update-user.usecase";
import { UpdateUserController } from "@/modules/users/presentation/http/controllers/update-user.controller";
import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { ENV } from "@/core/config/env";

export const UpdateUserControllerFactory = (): Controller => {
  const userRepo = new SequelizeUserRepository();

  const salt =
    ENV.SALT && !Number.isNaN(Number(ENV.SALT)) ? Number(ENV.SALT) : 12;
  const encrypter = new BcryptAdapter(salt);

  const useCase = new UpdateUserUseCase(userRepo, userRepo, encrypter);
  const controller = new UpdateUserController(useCase);

  return controller;
};