// exemplo típico
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateBody =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten(),
      });
    }
    req.body = result.data;
    next();
  };

export default validateBody;
