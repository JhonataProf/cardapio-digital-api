import { Express, NextFunction, Request, Response } from "express";
import { AppError } from "@/core/errors-app-error"; // ajuste o path se necessário
import { logger } from "@/core/config/logger";

function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Rota não encontrada" });
}

function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const isProd = process.env.NODE_ENV === "production";

  // ✅ trate AppError primeiro
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      // opcional: links se você quiser padronizar
      // links: ...
    });
  }

  // ✅ log estruturado
  logger.error("Unhandled error", {
    path: req.path,
    method: req.method,
    error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
  });

  const status = err?.statusCode ?? 500;
  const payload: any = {
    message: err?.message ?? "Erro interno",
  };

  if (!isProd) payload.stack = err?.stack;

  return res.status(status).json(payload);
}

export default function setupErrorHandlers(app: Express) {
  app.use(notFoundHandler);
  app.use(errorHandler);
}
