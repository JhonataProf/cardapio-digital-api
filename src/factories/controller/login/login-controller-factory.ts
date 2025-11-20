// src/factories/controller/login/login-controller-factory.ts

import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import { TokenAdapter } from "@/adapters/token-adapter"; // ajuste o nome real
import { ENV } from "@/config/env";
import LoginController from "@/controllers/login/login";
import { Controller } from "@/protocols";
import { LoginService } from "@/service/login-service";

export const LoginControllerFactory = (): Controller => {
  const saltRounds = ENV.SALT ? Number(ENV.SALT) : 12;

  const encrypter = new BcryptAdapter(saltRounds);
  const tokenizer = new TokenAdapter(); // ajuste params se precisar (ex.: secret, expiração etc.)

  const loginService = new LoginService(encrypter, tokenizer);
  const controller = new LoginController(loginService);

  return controller;
};
