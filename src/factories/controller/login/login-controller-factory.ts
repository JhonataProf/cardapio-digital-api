import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { TokenAdapter } from "@/core/adapters/token-adapter";
import { ENV } from "@/core/config/env";
import LoginController from "@/controllers/login/login";
import { Controller } from "@/core/protocols";
import { LoginService } from "@/service/login-service";

export const LoginControllerFactory = (): Controller => {
  const encrypter = new BcryptAdapter(ENV.SALT || 10);
  const tokenizer = new TokenAdapter();
  const loginService = new LoginService(encrypter, tokenizer);
  return new LoginController(loginService);
};
