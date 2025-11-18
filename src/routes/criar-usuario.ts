import { Router } from "express";
import adaptRoute from "../adapters/express-route-adapter";
import CriarUsuarioController from "../controllers/usuario/criar-usuario";
import { authMiddleware, authorizeRoles } from "../middlewares";
import { validateBody } from "../middlewares/validate-body";
import { createUserSchema } from "../schemas";

export default (router: Router): void => {
  router.post(
    "/users",
    adaptRoute(new CriarUsuarioController())
  );
};
