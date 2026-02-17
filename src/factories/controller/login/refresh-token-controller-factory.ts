import { TokenAdapter } from "@/core/adapters/token-adapter";
import RefreshTokenController from "@/controllers/login/refresh-token";
import { Controller } from "@/core/protocols";

export const RefreshTokenControllerFactory = (): Controller => {
  const tokenizer = new TokenAdapter();
  return new RefreshTokenController(tokenizer);
};