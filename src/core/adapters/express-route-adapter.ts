import { Request, Response } from "express";
import { Controller, HttpRequest } from "@/core/protocols";

const NO_CONTENT = 204;
const adaptRoute = (controller: Controller) => {
  return async function (req: Request, res: Response) {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      user: (req as any).user,
      correlationId: (req as any).correlationId,
      pathParams: req.params,
    };
    try {
      const httpResponse = await controller.handle(httpRequest);

      if (httpResponse.statusCode === NO_CONTENT) {
        return res.status(NO_CONTENT).send();
      }

      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
};

export default adaptRoute;