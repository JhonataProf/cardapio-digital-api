import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { GetUserByIdControllerFactory } from "@/factories/controller/usuario/get-user-by-id-controller-factory";
// import authMiddleware from "@/middlewares/auth-middleware";
// import authorizeRoles from "@/middlewares/authorize-roles";

export default (router: Router): void => {
  router.get(
    "/usuarios/:id",
    // authMiddleware,
    // authorizeRoles(["Gerente"]),
    adaptRoute(GetUserByIdControllerFactory())
  );
};
