import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { UpdateUserControllerFactory } from "@/factories/controller/usuario/update-user-controller-factory";
import { validateBody } from "@/core/http/middlewares/validate-body";
import { updateUserSchema } from "@/modules/users/presentation/http/validators/user-schemas";
import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";

export default (router: Router): void => {
  router.put(
    "/usuarios/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    validateBody(updateUserSchema),
    adaptRoute(UpdateUserControllerFactory())
  );
};