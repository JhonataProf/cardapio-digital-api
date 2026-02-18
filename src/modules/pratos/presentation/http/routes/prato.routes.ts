import adaptRoute from "@/core/adapters/express-route-adapter";
import { authMiddleware, authorizeRoles } from "@/core/http/middlewares";
import { Router } from "express";
import { CriarPratoController } from "../controller/criar-prato";
import DeletarPratoController from "../controller/deletar-prato";
import EditarPratoController from "../controller/editar-prato";
import ListarPratoController from "../controller/listar-prato";

export function registerPratoRoutes(router: Router): void {

    router.post(
    "/pratos",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new CriarPratoController())
  );

   router.delete(
    "/pratos/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new DeletarPratoController())
  );

  router.put(
    "/pratos/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new EditarPratoController())
  );

  router.get("/pratos{/:id}", adaptRoute(new ListarPratoController()));
}