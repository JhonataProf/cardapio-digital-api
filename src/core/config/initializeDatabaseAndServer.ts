import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { ENV } from "./env";

export const initializeDatabaseAndServer = async (sequelize: Sequelize) => {
  if (!ENV.UPDATE_MODEL) return; // evita sobrescrita se flag estiver habilitada

  try {
    const modelsPath = path.resolve(__dirname, "../models");
    if (!fs.existsSync(modelsPath)) {
      console.warn("Pasta de models não encontrada:", modelsPath);
      return;
    }

    const exts =
      process.env.NODE_ENV === "production" ? [".js"] : [".ts", ".js"];
    const modelFiles = fs
      .readdirSync(modelsPath)
      .filter((file) => exts.some((ext) => file.endsWith(`-model${ext}`)));

    const db: Record<string, any> = { sequelize, Sequelize };

    // Carrega models
    for (const file of modelFiles) {
      const mod = await import(path.join(modelsPath, file));
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

    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida.");

    // Em produção: sem force/alter; em dev: alter opcional; em test: geralmente recria
    const syncOptions =
      ENV.NODE_ENV === "production"
        ? {}
        : ENV.NODE_ENV === "test"
        ? { force: true }
        : { alter: true };

    await sequelize.sync(syncOptions);
    console.log("Banco sincronizado.");
  } catch (err) {
    console.error("Erro ao inicializar DB:", err);
    throw err;
  }
};
