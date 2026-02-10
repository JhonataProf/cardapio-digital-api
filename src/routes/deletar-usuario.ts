import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import DeletarUsuarioController from "../controllers/usuario/deletar-usuario";
import { authMiddleware, authorizeRoles } from "@/core/middlewares";
export default (router: Router): void => {
  router.delete(
    "/users/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new DeletarUsuarioController())
  );
};
