import { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase";
import { FindUserByEmailRepository } from "@/modules/users/domain/repositories/find-user-by-email.repository";
import { Encrypter, Tokenizer } from "@/interfaces";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { DomainLogger } from "@/shared/logger/domain-logger";
import { AppError } from "@/shared/errors-app-error";

describe("LoginUseCase", () => {
  const makeUser = () =>
    new UserEntity({
      id: 1,
      nome: "User Teste",
      email: "user@example.com",
      senha: "hashed-password",
      role: "Gerente",
    });

  const makeSut = () => {
    const findUserByEmailRepoMock: FindUserByEmailRepository = {
      findByEmail: jest.fn(async () => makeUser()),
    };

    const encrypterMock: Encrypter = {
      hash: jest.fn(),
      compare: jest.fn(async () => true),
    };

    const tokenizerMock: Tokenizer = {
      verifyToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      generateToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as any;

    const loggerMock: DomainLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const sut = new LoginUseCase(
      findUserByEmailRepoMock,
      encrypterMock,
      tokenizerMock,
      loggerMock
    );

    return {
      sut,
      findUserByEmailRepoMock,
      encrypterMock,
      tokenizerMock,
      loggerMock,
    };
  };

  it("deve realizar login com sucesso e retornar tokens + user", async () => {
    const { sut, findUserByEmailRepoMock, encrypterMock, tokenizerMock } =
      makeSut();

    const input = {
      email: "user@example.com",
      senha: "plain-password",
    };

    const result = await sut.execute(input);

    expect(findUserByEmailRepoMock.findByEmail).toHaveBeenCalledWith(
      "user@example.com"
    );
    expect(encrypterMock.compare).toHaveBeenCalledWith(
      "plain-password",
      "hashed-password"
    );

    // aqui assumo que você chama tokenizer.sign duas vezes (access + refresh)
    expect(
      (tokenizerMock.generateToken as jest.Mock).mock.calls.length
    ).toBeGreaterThan(0);

    expect(result).toHaveProperty("accessToken");
    expect(result).toHaveProperty("refreshToken");
    expect(result.user).toMatchObject({
      id: 1,
      email: "user@example.com",
      role: "Gerente",
    });
  });

  it("deve lançar AppError AUTH_USER_NOT_FOUND quando usuário não existir", async () => {
    const { sut, findUserByEmailRepoMock } = makeSut();

    (findUserByEmailRepoMock.findByEmail as jest.Mock).mockResolvedValueOnce(
      null
    );

    const input = {
      email: "notfound@example.com",
      senha: "123456",
    };

    await expect(sut.execute(input)).rejects.toMatchObject<AppError>({
      code: "AUTH_USER_NOT_FOUND",
      statusCode: 404,
      message: `Usuário com e-mail ${input.email} não foi encontrado`,
      name: "AppError",
    });
  });

  it("deve lançar AppError INVALID_CREDENTIALS quando senha for inválida", async () => {
    const { sut, encrypterMock } = makeSut();

    (encrypterMock.compare as jest.Mock).mockResolvedValueOnce(false);

    const input = {
      email: "user@example.com",
      senha: "senha-errada",
    };

    await expect(sut.execute(input)).rejects.toMatchObject<AppError>({
      code: "INVALID_CREDENTIALS",
      statusCode: 401,
      message: "E-mail ou senha inválidos",
      details: {},
      name: "AppError",
    });
  });
});
