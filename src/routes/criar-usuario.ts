import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { CreateUserControllerFactory } from "@/factories/controller/usuario/create-user-controller-factory";
import { validateBody } from "@/core/http/middlewares/validate-body";
import { createUserSchema } from "@/modules/users/presentation/http/validators/user-schemas";
import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";

export default (router: Router): void => {
  router.post(
    "/usuarios",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    validateBody(createUserSchema),
    adaptRoute(CreateUserControllerFactory())
  );
};