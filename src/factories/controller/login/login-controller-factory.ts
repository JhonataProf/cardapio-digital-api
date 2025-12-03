// src/factories/controller/login/login-controller-factory.ts

import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import { ENV } from "@/config/env";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase";
import { JwtAuthTokenService } from "@/modules/auth/infra/jwt-auth-token.service";
import { LoginController } from "@/modules/auth/presentation/http/controllers/login.controller";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository"; // exemplo
import { Controller } from "@/protocols";
import { logger } from "@/shared/logger";

export const LoginControllerFactory = (): Controller => {
  const saltRounds = ENV.SALT ? Number(ENV.SALT) : 12;

  const userRepo = new SequelizeUserRepository();
  const encrypter = new BcryptAdapter(saltRounds);
  const tokenService = new JwtAuthTokenService(); // ajuste params se precisar (ex.: secret, expiração etc.)

  const useCase = new LoginUseCase(userRepo, encrypter, tokenService, logger);
  const controller = new LoginController(useCase);

  return controller;
};
