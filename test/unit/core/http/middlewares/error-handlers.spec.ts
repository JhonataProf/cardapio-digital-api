import setupErrorHandlers from "@/core/http/middlewares/error-handlers";

describe("error-handlers", () => {
  const makeRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });

  it("deve responder 404 no notFoundHandler", () => {
    const app: any = { use: jest.fn() };
    setupErrorHandlers(app);

    const notFound = app.use.mock.calls[0][0];

    const res = makeRes();
    notFound({}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Rota não encontrada" });
  });

  it("deve usar statusCode do erro quando existir", () => {
    process.env.NODE_ENV = "production";

    const app: any = { use: jest.fn() };
    setupErrorHandlers(app);

    const errorHandler = app.use.mock.calls[1][0];

    const res = makeRes();
    const err = { statusCode: 400, message: "Erro custom" };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro custom" });
  });

  it("deve retornar 500 para erro genérico", () => {
    process.env.NODE_ENV = "production";

    const app: any = { use: jest.fn() };
    setupErrorHandlers(app);

    const errorHandler = app.use.mock.calls[1][0];

    const res = makeRes();

    errorHandler(new Error("boom"), {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "boom", // ✅ seu handler retorna err.message
    });
  });

  it("deve incluir stack quando não for production", () => {
    process.env.NODE_ENV = "development";

    const app: any = { use: jest.fn() };
    setupErrorHandlers(app);

    const errorHandler = app.use.mock.calls[1][0];

    const res = makeRes();
    const err = new Error("boom");

    errorHandler(err, {}, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "boom",
        stack: expect.any(String),
      })
    );
  });
});
