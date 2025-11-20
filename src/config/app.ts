// src/config/app.ts
import { setupErrorHandlers } from "@/middlewares";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { ENV } from "./env";
import setupMiddlewares from "./middlewares";
import { resolveRuntimePath } from "./paths";
import setupRoutes from "./routes";

export const createApp = (): Application => {
  const app = express();

  // Swagger opcional
  if (ENV.SWAGGER_ENABLED) {
    const swaggerFile = resolveRuntimePath("docs/api/swagger.yaml");
    const swaggerDocument = YAML.load(swaggerFile);

    // Redireciona raiz para /api-docs
    app.get("/", (_req, res) => res.redirect("/api-docs"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    app.get("/", (_req, res) => res.status(204).end());
  }

  // Middlewares globais (incluindo CORS, JSON parser, security headers, etc.)
  setupMiddlewares(app);

  // Rotas da aplicação
  setupRoutes(app);

  // Error handlers devem SEMPRE ser os últimos
  setupErrorHandlers(app);

  return app;
};

// compatibilidade com o que você já usa hoje (default import)
const app = createApp();
export default app;
