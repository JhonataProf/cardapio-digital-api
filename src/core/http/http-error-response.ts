import { HttpResponse } from "@/core/protocols/http";
import { AppError } from "@/core/errors-app-error";

interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    correlationId?: string;
    [key: string]: any;
  };
}

export const errorResponse = (
  statusCode: number,
  code: string,
  message: string,
  correlationId?: string,
  details?: unknown
): HttpResponse<ErrorBody> => ({
  statusCode,
  body: {
    error: { code, message, details },
    meta: { correlationId },
  },
});

export const mapErrorToHttpResponse = (
  error: unknown,
  correlationId?: string
): HttpResponse<ErrorBody> => {
  if (error instanceof AppError) {
    return errorResponse(
      error.statusCode,
      error.code,
      error.message,
      correlationId,
      error.details
    );
  }

  // fallback genérico
  return errorResponse(
    500,
    "INTERNAL_SERVER_ERROR",
    "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    correlationId
  );
};