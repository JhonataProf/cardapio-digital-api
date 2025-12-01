// src/factories/controller/login/login-controller-factory.ts

import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import { TokenAdapter } from "@/adapters/token-adapter"; // ajuste o nome real
import { ENV } from "@/config/env";
import { Controller } from "@/protocols";
import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository"; // exemplo
import { JwtAuthTokenService } from "@/modules/auth/infra/jwt-auth-token.service";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase";
import { logger } from "@/shared/logger";
import { LoginController } from "@/modules/auth/presentation/http/controllers/login.controller";

export const LoginControllerFactory = (): Controller => {
  const saltRounds = ENV.SALT ? Number(ENV.SALT) : 12;

  const userRepo = new SequelizeUserRepository();
  const encrypter = new BcryptAdapter(saltRounds);
  const tokenService = new JwtAuthTokenService(); // ajuste params se precisar (ex.: secret, expiração etc.)

  const useCase = new LoginUseCase(userRepo, encrypter, tokenService, logger);
  const controller = new LoginController(useCase);

  return controller;
};
