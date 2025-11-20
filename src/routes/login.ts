// src/routes/login.ts
import { LoginControllerFactory } from "@/factories/controller/login/login-controller-factory";
import { Router } from "express";
import adaptRoute from "../adapters/express-route-adapter";

export default (router: Router): void => {
  /**
   * POST /login
   * Rota de autenticação.
   * Futuro: mover para /auth/login dentro do bounded context de auth.
   */
  router.post("/login", adaptRoute(LoginControllerFactory()));
};
