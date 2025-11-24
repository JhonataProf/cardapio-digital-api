import { CreateUserUseCase } from "@/modules/users/application/use-cases/create-user.usecase";
import { CreateUserRepository } from "@/modules/users/domain/repositories/create-user.repository";
import { FindUserByEmailRepository } from "@/modules/users/domain/repositories/find-user-by-email.repository";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { Encrypter } from "@/interfaces";

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

    const sut = new CreateUserUseCase(
      createRepoMock,
      findByEmailRepoMock,
      encrypterMock
    );

    return { sut, createRepoMock, findByEmailRepoMock, encrypterMock };
  };

  it("deve criar um usuário com senha criptografada quando email não existe", async () => {
    const { sut, createRepoMock, findByEmailRepoMock, encrypterMock } =
      makeSut();

    const input = {
      nome: "Fulano",
      email: "fulano@example.com",
      senha: "123456",
      role: "Funcionario",
    } as any; // compat com CreateUserDTO (z.infer)

    const result = await sut.execute(input);

    expect(findByEmailRepoMock.findByEmail).toHaveBeenCalledWith(
      "fulano@example.com"
    );
    expect(encrypterMock.hash).toHaveBeenCalledWith("123456");

    const userPassedToCreate = (createRepoMock.create as jest.Mock).mock
      .calls[0][0] as UserEntity;
    expect(userPassedToCreate.senha).toBe("hashed-123456");

    expect(result.id).toBe(1);
    expect(result.email).toBe("fulano@example.com");
  });

  it("deve lançar erro EMAIL_ALREADY_IN_USE quando o email já existe", async () => {
    const { sut, findByEmailRepoMock } = makeSut();

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

    await expect(sut.execute(input)).rejects.toThrow("EMAIL_ALREADY_IN_USE");
  });
});
