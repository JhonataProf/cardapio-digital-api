import type { Request, Response, NextFunction } from "express";
import type { Controller, HttpRequest, HttpResponse } from "@/core/protocols";

describe("core/adapters/express-route-adapter", () => {
  it("deve adaptar Controller para Express (status/body/headers)", async () => {
    const { default: adaptRoute } = await import("@/core/adapters/express-route-adapter");

    const controller: Controller = {
      handle: jest.fn(async (_req: HttpRequest): Promise<HttpResponse> => {
        return {
          statusCode: 201,
          body: { ok: true }
        };
      }),
    };

    const req = {
      body: { a: 1 },
      params: { id: "10" },
      query: { q: "x" },
      headers: { "x-correlation-id": "cid-1" },
      method: "POST",
      path: "/x",
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;

    const handler = adaptRoute(controller);
    await handler(req, res);

    expect(controller.handle).toHaveBeenCalledTimes(1);

    // status + body
    expect((res.status as jest.Mock)).toHaveBeenCalledWith(201);
    expect((res.json as jest.Mock)).toHaveBeenCalledWith({ ok: true });

    // não deveria ter chamado next em sucesso
    expect(next).not.toHaveBeenCalled();
  });
});
