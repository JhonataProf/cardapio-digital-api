import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import ListarUsuarioController from "../controllers/usuario/listar-usuario";
import { authMiddleware, authorizeRoles } from "@/core/middlewares";

export default (router: Router): void => {
  router.get(
    "/users{/:id}",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new ListarUsuarioController())
  );
};
