import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { DeletarPedidoController } from "../controllers/pedido/deletar-pedido";
import { authMiddleware, authorizeRoles } from "@/core/middlewares";

export default (router: Router): void => {
  router.delete(
    "/pedidos/{:id}",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new DeletarPedidoController())
  );
};
