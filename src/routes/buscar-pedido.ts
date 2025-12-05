import { Router } from "express";
import adaptRoute from "../adapters/express-route-adapter";
import { BuscarPedidoController } from "../controllers/pedido/buscar-pedido";
import { authMiddleware } from "../middlewares";

export default (router: Router): void => {
  router.get(
    "/pedidos/{:id}",
    authMiddleware,
    adaptRoute(new BuscarPedidoController())
  );
};
