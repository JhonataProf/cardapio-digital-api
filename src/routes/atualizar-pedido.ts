import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { AtualizarPedidoController } from "../controllers/pedido/atualizar-pedido";
import { authMiddleware, authorizeRoles } from "@/core/http/middlewares";

export default (router: Router): void => {
  router.put(
    "/pedidos/{:id}",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new AtualizarPedidoController())
  );
};