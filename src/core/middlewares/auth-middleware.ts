import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type AppJwtPayload = JwtPayload & {
  sub: string;
  email?: string;
  role?: string;
};

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization ?? "";
    const [scheme = "", token] = authHeader.split(" ");

    if (!token || !/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ message: "Credenciais ausentes ou inválidas" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Falhar cedo: sem segredo, não dá pra validar
      return res.status(500).json({ message: "Configuração de autenticação ausente" });
    }

    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] }) as AppJwtPayload;

    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch (err: any) {
    // Evite vazar detalhes (ex.: expiração) — responda genericamente
    return res.status(401).json({ message: "Não autorizado" });
  }
}
