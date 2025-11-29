import { CreateUserUseCase } from "@/modules/users/application/use-cases/create-user.usecase";
import { CreateUserRepository } from "@/modules/users/domain/repositories/create-user.repository";
import { FindUserByEmailRepository } from "@/modules/users/domain/repositories/find-user-by-email.repository";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { Encrypter } from "@/interfaces";
import { AppError } from "@/shared/errors-app-error";
import { DomainLogger } from "@/shared/logger/domain-logger";

describe("CreateUserUseCase", () => {
  const makeSut = () => {
    const createRepoMock: CreateUserRepository = {
      create: jest.fn(async (user: UserEntity) => {
        return new UserEntity({
          id: 1,
          nome: user.nome,
          email: user.email,
          senha: user.senha,
          role: user.role,
        });
      }),
    };

    const findByEmailRepoMock: FindUserByEmailRepository = {
      findByEmail: jest.fn(async () => null),
    };

    const encrypterMock: Encrypter = {
      hash: jest.fn(async (value: string) => `hashed-${value}`),
      compare: jest.fn(),
    };

    const loggerMock: DomainLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const sut = new CreateUserUseCase(
      createRepoMock,
      findByEmailRepoMock,
      encrypterMock,
      loggerMock
    );

    return {
      sut,
      createRepoMock,
      findByEmailRepoMock,
      encrypterMock,
      loggerMock,
    };
  };

  it("deve criar um usuário com senha criptografada quando email não existe", async () => {
    const {
      sut,
      findByEmailRepoMock,
      encrypterMock,
      createRepoMock,
      loggerMock,
    } = makeSut();

    const input = {
      nome: "Fulano",
      email: "fulano@example.com",
      senha: "123456",
      role: "Funcionario",
    } as any;

    const result = await sut.execute(input);

    expect(findByEmailRepoMock.findByEmail).toHaveBeenCalledWith(
      "fulano@example.com"
    );
    expect(encrypterMock.hash).toHaveBeenCalledWith("123456");

    const [userPassed] = (createRepoMock.create as jest.Mock).mock.calls[0] as [
      UserEntity
    ];
    expect(userPassed.senha).toBe("hashed-123456");

    expect(result.id).toBe(1);
    expect(result.email).toBe("fulano@example.com");

    expect(loggerMock.info).toHaveBeenCalledWith(
      "Iniciando CreateUserUseCase",
      expect.objectContaining({ email: "fulano@example.com" })
    );
    expect(loggerMock.info).toHaveBeenCalledWith(
      "Usuário criado com sucesso",
      expect.objectContaining({ userId: 1, email: "fulano@example.com" })
    );
  });

  it("deve lançar AppError EMAIL_ALREADY_IN_USE quando o email já existe", async () => {
    const { sut, findByEmailRepoMock, loggerMock } = makeSut();

    (findByEmailRepoMock.findByEmail as jest.Mock).mockResolvedValueOnce(
      new UserEntity({
        id: 99,
        nome: "Outro",
        email: "exists@example.com",
        senha: "hash",
        role: "Cliente",
      })
    );

    const input = {
      nome: "Fulano",
      email: "exists@example.com",
      senha: "123456",
      role: "Funcionario",
    } as any;

    await expect(sut.execute(input)).rejects.toMatchObject<AppError>({
      code: "EMAIL_ALREADY_IN_USE",
      statusCode: 409,
      message: "O e-mail exists@example.com já está em uso",
      name: "AppError",
    });

    expect(loggerMock.info).toHaveBeenCalledWith(
      "Email já está em uso",
      expect.objectContaining({ email: "exists@example.com" })
    );
  });
});
