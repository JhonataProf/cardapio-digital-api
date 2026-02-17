import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";
import { CriarPedidoController } from "../controllers/pedido/criar-pedido";
import { authMiddleware } from "@/core/http/middlewares";

export default (router: Router): void => {
  router.post(
    "/pedidos/",
    authMiddleware,
    adaptRoute(new CriarPedidoController())
  );
};