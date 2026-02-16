import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { ListUsersControllerFactory } from "@/factories/controller/usuario/list-users-controller-factory";
// import authMiddleware from "@/middlewares/auth-middleware";
// import authorizeRoles from "@/middlewares/authorize-roles";

export default (router: Router): void => {
  router.get(
    "/usuarios",
    // authMiddleware,
    // authorizeRoles(["Gerente"]),
    adaptRoute(ListUsersControllerFactory())
  );
};
