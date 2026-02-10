import { Request, Response } from "express";
import { Controller, HttpRequest } from "../protocols";
const adaptRoute = (controller: Controller) => {
  return async function (req: Request, res: Response) {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      pathParams: req.params,
      query: req.query,
    };
    try {
      const httpResponse = await controller.handle(httpRequest);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
};

export default adaptRoute;
