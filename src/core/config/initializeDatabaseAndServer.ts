// src/config/initializeDatabaseAndServer.ts
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { ENV } from "./env";
import { logger } from "@/core/config/logger";

export const initializeDatabaseAndServer = async (sequelize: Sequelize) => {
  if (!ENV.UPDATE_MODEL) {
    logger.info("DB init skipped because ENV.UPDATE_MODEL is disabled");
    return;
  }

  try {
    const modelsPath = path.resolve(__dirname, "../../models");

    if (!fs.existsSync(modelsPath)) {
      logger.warn("Models folder not found", { modelsPath });
      return;
    }

    const exts = ENV.NODE_ENV === "production" ? [".js"] : [".ts", ".js"];

    const modelFiles = fs
      .readdirSync(modelsPath)
      .filter((file) => exts.some((ext) => file.endsWith(`-model${ext}`)));

    const db: Record<string, any> = { sequelize, Sequelize };

    logger.info("Loading Sequelize models", { modelsPath, modelFiles });

    // Carrega models
    for (const file of modelFiles) {
      const fullPath = path.join(modelsPath, file);
      const mod = await import(fullPath);
      const model = mod.default ?? mod;
      const modelName = file.replace(/-model\.(ts|js)$/, "");
      db[modelName] = model;
    }

    // Associações padrão (se o model expuser .associate)
    Object.values(db).forEach((m: any) => {
      if (m && typeof m.associate === "function") {
        m.associate(db);
      }
    });

    logger.info("Authenticating DB connection...");
    await sequelize.authenticate();
    logger.info("DB connection established");

    const syncOptions =
      ENV.NODE_ENV === "production"
        ? {}
        : ENV.NODE_ENV === "test"
        ? { force: true } // recria para testes
        : { alter: true }; // dev: atualiza schema sem perder dados (ainda assim com cuidado)

    logger.info("Syncing database schema", { syncOptions });

    await sequelize.sync(syncOptions);
    logger.info("Database schema synchronized successfully");
  } catch (err) {
    logger.error("Error during DB initialization", {
      error:
        err instanceof Error ? { message: err.message, stack: err.stack } : err,
    });
    throw err; // importante propagar para o server decidir se sobe ou não
  }
};