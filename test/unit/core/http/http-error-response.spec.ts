import {
  errorResponse,
  mapErrorToHttpResponse,
} from "@/core/http/http-error-response";
import { AppError } from "@/core/errors-app-error";

describe("core/http/http-error-response", () => {
  it("errorResponse() deve montar HttpResponse com statusCode e body padronizado", () => {
    const res = errorResponse(
      401,
      "UNAUTHORIZED",
      "Credenciais ausentes ou inválidas",
      "corr-1",
      { reason: "missing token" }
    );

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Credenciais ausentes ou inválidas",
        details: { reason: "missing token" },
      },
      meta: { correlationId: "corr-1" },
    });
  });

  it("mapErrorToHttpResponse() deve mapear AppError usando errorResponse()", () => {
    const err = new AppError({
      code: "EMAIL_ALREADY_IN_USE",
      message: "E-mail já está em uso",
      statusCode: 409,
      details: { email: "x@x.com" },
    });

    const res = mapErrorToHttpResponse(err, "corr-2");

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      error: {
        code: "EMAIL_ALREADY_IN_USE",
        message: "E-mail já está em uso",
        details: { email: "x@x.com" },
      },
      meta: { correlationId: "corr-2" },
    });
  });

  it("mapErrorToHttpResponse() deve retornar fallback 500 para erro genérico", () => {
    const res = mapErrorToHttpResponse(new Error("boom"), "corr-3");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        details: undefined,
      },
      meta: { correlationId: "corr-3" },
    });
  });

  it("mapErrorToHttpResponse() deve retornar fallback 500 mesmo com valor não-Error", () => {
    const res = mapErrorToHttpResponse("qualquer-coisa" as any, "corr-4");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        details: undefined,
      },
      meta: { correlationId: "corr-4" },
    });
  });
});
