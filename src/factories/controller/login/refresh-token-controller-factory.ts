import { TokenAdapter } from "@/adapters/token-adapter";
import RefreshTokenController from "@/controllers/login/refresh-token";
import { Controller } from "@/protocols";

export const RefreshTokenControllerFactory = (): Controller => {
  const tokenizer = new TokenAdapter();
  return new RefreshTokenController(tokenizer);
};
