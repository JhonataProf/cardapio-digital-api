import { RefreshTokenControllerFactory } from "@/factories/controller/login/refresh-token-controller-factory";
import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";

export default (router: Router): void => {
  router.post("/refresh-token", adaptRoute(RefreshTokenControllerFactory()));
};