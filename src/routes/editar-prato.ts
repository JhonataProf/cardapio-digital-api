import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import EditarPratoController from "../controllers/prato/editar-prato";
import { authMiddleware, authorizeRoles } from "@/core/http/middlewares";

export default (router: Router): void => {
  router.put(
    "/pratos/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new EditarPratoController())
  );
};