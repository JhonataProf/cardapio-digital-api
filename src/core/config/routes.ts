import { Express, Router } from "express";
import { registerAuthRoutes } from "@/modules/auth/presentation/http/routes/auth.routes";
import { registerUserRoutes } from "@/modules/users/presentation/http/routes/user.routes";

export default function setupRoutes(app: Express): void {
  const router = Router();

  app.use("/api", router);

  registerAuthRoutes(router);
  registerUserRoutes(router);

  // pratos/pedidos depois
}
