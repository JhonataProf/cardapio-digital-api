// src/core/config/initializeDatabaseAndServer.ts
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Sequelize } from "sequelize";
import { ENV } from "./env";
import { logger } from "./logger";
import { resolveRuntimeDir } from "./paths";

type WalkOptions = {
  exts: string[];
  match: (fullPath: string) => boolean;
};

async function importModule(fullPath: string) {
  try {
    return await import(fullPath); // ✅ CJS-friendly
  } catch {
    return await import(pathToFileURL(fullPath).href); // ✅ ESM-friendly fallback
  }
}

function walkDir(root: string, opts: WalkOptions, acc: string[] = []): string[] {
  if (!fs.existsSync(root)) return acc;

  const entries = fs.readdirSync(root, { withFileTypes: true });

  for (const e of entries) {
    // opcional: ignore pastas comuns
    if (e.isDirectory() && ["node_modules", "dist", "coverage"].includes(e.name)) continue;

    const full = path.join(root, e.name);

    if (e.isDirectory()) {
      walkDir(full, opts, acc);
      continue;
    }

    const hasExt = opts.exts.some((ext) => full.endsWith(ext));
    if (!hasExt) continue;

    if (opts.match(full)) acc.push(full);
  }

  return acc;
}

export const initializeDatabaseAndServer = async (sequelize: Sequelize) => {
  if (!ENV.UPDATE_MODEL) {
    logger.info("DB init skipped because ENV.UPDATE_MODEL is disabled");
    return;
  }

  try {
    const exts = ENV.NODE_ENV === "production" ? [".js"] : [".ts", ".js"];

    const modelsDir = resolveRuntimeDir("models");   // src/models (legado)
    const modulesDir = resolveRuntimeDir("modules"); // src/modules (novo)

    const roots = [modelsDir, modulesDir].filter(Boolean) as string[];

    if (roots.length === 0) {
      logger.warn("No models/modules folders found to load models");
      return;
    }

    const modelFiles = roots.flatMap((root) =>
      walkDir(root, {
        exts,
        match: (fullPath) => /-model\.(ts|js)$/.test(fullPath),
      })
    );

    logger.info("Loading Sequelize models (dynamic)", {
      roots,
      count: modelFiles.length,
    });

    const db: Record<string, any> = { sequelize, Sequelize };

    for (const fullPath of modelFiles) {
      // Import robusto (funciona melhor com caminhos absolutos)
      const mod = await importModule(fullPath);
      const model = mod.default ?? mod;

      const fileName = path.basename(fullPath);
      const modelName = fileName.replace(/-model\.(ts|js)$/, "");

      db[modelName] = model;
    }

    // associações se existirem
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
          ? { force: true }
          : { alter: true };

    logger.info("Syncing database schema", { syncOptions });
    await sequelize.sync(syncOptions);
    logger.info("Database schema synchronized successfully");
  } catch (err) {
    logger.error("Error during DB initialization", {
      error: err instanceof Error ? { message: err.message, stack: err.stack } : err,
    });
    throw err;
  }
};
