import { Router } from "express";
import adaptRoute from "../adapters/express-route-adapter";
import { DeletarPedidoController } from "../controllers/pedido/deletar-pedido";
import { authMiddleware, authorizeRoles } from "../middlewares";

export default (router: Router): void => {
  router.delete(
    "/pedidos/{:id}",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new DeletarPedidoController())
  );
};
