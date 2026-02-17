import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { DeleteUserControllerFactory } from "@/factories/controller/usuario/delete-user-controller-factory";
import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";

export default (router: Router): void => {
  router.delete(
    "/usuarios/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(DeleteUserControllerFactory())
  );
};