import { RefreshTokenUseCase } from "@/modules/auth/application/use-cases/refresh-token.usecase";
import { Tokenizer } from "@/interfaces";
import { DomainLogger } from "@/shared/logger/domain-logger";
import { AppError } from "@/shared/errors-app-error";

describe("RefreshTokenUseCase", () => {
  const makeSut = () => {
    const tokenizerMock: Tokenizer = {
      generateToken: jest.fn(() => "new-access-token"),
      verifyRefreshToken: jest.fn(() => ({
        sub: "1",
        email: "user@example.com",
        role: "Gerente",
      })),
    } as any;

    const loggerMock: DomainLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const sut = new RefreshTokenUseCase(tokenizerMock, loggerMock);

    return {
      sut,
      tokenizerMock,
      loggerMock,
    };
  };

  it("deve gerar um novo access token a partir de um refresh token válido", async () => {
    const { sut, tokenizerMock } = makeSut();

    const result = await sut.execute("valid-refresh-token");

    expect(tokenizerMock.verifyRefreshToken).toHaveBeenCalledWith(
      "valid-refresh-token"
    );
    expect(tokenizerMock.generateToken).toHaveBeenCalled();
    expect(result).toEqual({ accessToken: "new-access-token" });
  });

  it("deve lançar AppError INVALID_REFRESH_TOKEN se verify retornar algo inválido", async () => {
    const { sut, tokenizerMock } = makeSut();

    (tokenizerMock.verifyRefreshToken as jest.Mock).mockReturnValueOnce(null);

    await expect(sut.execute("invalid-token")).rejects.toMatchObject<AppError>({
      code: "INVALID_REFRESH_TOKEN",
      statusCode: 401,
      message: "Refresh token inválido ou expirado",
      name: "AppError",
    });
  });
});
