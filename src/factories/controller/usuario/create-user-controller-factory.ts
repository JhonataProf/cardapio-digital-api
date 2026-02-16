import { Controller } from "@/core/protocols";
import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { ENV } from "@/core/config/env";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";
import { CreateUserUseCase } from "@/modules/users/application/use-cases/create-user.usecase";
import { CreateUserController } from "@/modules/users/presentation/http/controllers/create-user.controller";

export const CreateUserControllerFactory = (): Controller => {
  const userRepo = new SequelizeUserRepository();

  const salt =
    ENV.SALT && !Number.isNaN(Number(ENV.SALT)) ? Number(ENV.SALT) : 12;
  const encrypter = new BcryptAdapter(salt);

  const useCase = new CreateUserUseCase(userRepo, userRepo, encrypter);
  const controller = new CreateUserController(useCase);

  return controller;
};
