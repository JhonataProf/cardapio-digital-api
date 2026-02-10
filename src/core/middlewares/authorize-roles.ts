import { NextFunction, Request, Response } from "express";

export default function authorizeRoles(roles: string[]) {
  const allowed = new Set(roles.map((r) => r.toLowerCase()));
  return (req: Request, res: Response, next: NextFunction) => {
    const role = ((req as any).user?.role ?? "").toLowerCase();
    if (!role || !allowed.has(role)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  };
}
