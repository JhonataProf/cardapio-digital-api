import { Express, Router } from "express";
import fg from "fast-glob";
import { resolveRuntimePath } from "./paths";
import path from "node:path";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);

  const routesDir = resolveRuntimePath("routes");
  const patterns = process.env.NODE_ENV === "production" ? ['**/*.js'] : ['**/*.js', '**/*.ts'];
  const files = fg.sync(patterns, { cwd: routesDir, absolute: true });

  for (const file of files) {
    // Evita carregar arquivos de tipagem/declaração
    if (file.endsWith(".d.ts")) continue;

    // Usar require para suportar CJS/TS transpilado
    const mod = require(file);
    const mount = mod.default ?? mod;
    if (typeof mount === "function") {
      mount(router);
    } else {
      console.warn(`[routes] O arquivo ${path.basename(file)} não exporta uma função padrão.`);
    }
  }
};
