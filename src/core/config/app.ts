import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import setupMiddlewares from "./middlewares";
import setupRoutes from "./routes";
import { resolveRuntimePath } from "./paths";
import { ENV } from "./env";
import { loadSwaggerDocument } from "./swagger";
import { setupErrorHandlers } from "@/core/middlewares";

const app = express();

// Swagger opcional
if (ENV.SWAGGER_ENABLED) {
  const swaggerDocument = loadSwaggerDocument();
  app.get("/", (_req, res) => res.redirect("/api-docs"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  app.get("/", (_req, res) => res.status(204).end());
}

// Middlewares **antes** das rotas
setupMiddlewares(app);

// Rotas
setupRoutes(app);
setupErrorHandlers(app);

export default app;
