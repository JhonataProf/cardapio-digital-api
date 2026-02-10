import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { BuscarPedidoController } from "../controllers/pedido/buscar-pedido";
import { authMiddleware } from "@/core/middlewares";

export default (router: Router): void => {
  router.get(
    "/pedidos/{:id}",
    authMiddleware,
    adaptRoute(new BuscarPedidoController())
  );
};
