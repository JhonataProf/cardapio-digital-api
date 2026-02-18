import adaptRoute from "@/core/adapters/express-route-adapter";
import { authMiddleware, authorizeRoles } from "@/core/http/middlewares";
import { Router } from "express";
import { AtualizarPedidoController } from "../controllers/atualizar-pedido";
import { BuscarPedidoController } from "../controllers/buscar-pedido";
import { CriarPedidoController } from "../controllers/criar-pedido";
import { DeletarPedidoController } from "../controllers/deletar-pedido";
import { ListarPedidoController } from "../controllers/listar-pedido";

export function registerPedidoRoutes(router: Router): void {

    router.put(
    "/pedidos/{:id}",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new AtualizarPedidoController())
  );

  router.get(
    "/pedidos/{:id}",
    authMiddleware,
    adaptRoute(new BuscarPedidoController())
  );

  router.get(
    "/pedidos",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new ListarPedidoController())
  );

  router.post(
    "/pedidos/",
    authMiddleware,
    adaptRoute(new CriarPedidoController())
  );

  router.delete(
    "/pedidos/{:id}",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new DeletarPedidoController())
  );
}