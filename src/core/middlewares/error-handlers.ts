import { Express, NextFunction, Router, Request, Response } from "express";

/**
 * Handlers de erro e 404 (boa prática centralizar)
 */
function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: "Rota não encontrada" });
}

function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const isProd = process.env.NODE_ENV === "production";
  const status = err?.statusCode ?? 500;
  const payload: any = {
    message: err?.message ?? "Erro interno",
  };
  if (!isProd) {
    payload.stack = err?.stack;
  }
  res.status(status).json(payload);
}

export default function setupErrorHandlers(app: Express) {
    const router = Router();
    
    // 5) Suas rotas entram DEPOIS (em app.ts)
    //    ... setupRoutes(app);

    // 6) 404 e erros no final
    app.use(notFoundHandler);
    app.use(errorHandler);
}