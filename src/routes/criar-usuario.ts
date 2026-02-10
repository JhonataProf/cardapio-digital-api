import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import CriarUsuarioController from "../controllers/usuario/criar-usuario";
import { authMiddleware, authorizeRoles } from "@/core/middlewares";
import { validateBody } from "@/core/middlewares/validate-body";
import { createUserSchema } from "../schemas";

export default (router: Router): void => {
  router.post(
    "/users",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    validateBody(createUserSchema),
    adaptRoute(new CriarUsuarioController())
  );
};
