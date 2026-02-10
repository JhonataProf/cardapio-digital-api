import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { ListarPedidoController } from "../controllers/pedido/listar-pedido";
import { authMiddleware, authorizeRoles } from "@/core/middlewares";

export default (router: Router): void => {
  router.get(
    "/pedidos",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new ListarPedidoController())
  );
};
