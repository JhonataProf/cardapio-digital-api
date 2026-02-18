import sequelize from "@/core/database";
import { DomainLogger } from "@/core/logger/domain-logger";
import { CreatePedidoUseCase } from "@/modules/pedidos/application/use-cases/create-pedido.usecase";
import { PedidoStatusEnum } from "@/modules/pedidos/domain/value-objects/pedido-status";

jest.mock("@/core/database", () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(),
  },
}));

describe("CreatePedidoUseCase", () => {
  const makeSut = () => {
    const findClienteByTelefoneRepo = {
      findByTelefone: jest.fn(),
    };

    const createPedidoRepo = {
      create: jest.fn(),
    };

    const logger: DomainLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    const sut = new CreatePedidoUseCase(
      findClienteByTelefoneRepo as any,
      createPedidoRepo as any,
      logger
    );

    return { sut, findClienteByTelefoneRepo, createPedidoRepo, logger };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um pedido (um por item) com status PENDENTE e total calculado", async () => {
    const { sut, findClienteByTelefoneRepo, createPedidoRepo, logger } =
      makeSut();

    jest.spyOn(Date, "now").mockReturnValue(1700000000000);

    (sequelize.transaction as jest.Mock).mockImplementation(
      async (fn: any) => await fn({ id: "tx" })
    );

    findClienteByTelefoneRepo.findByTelefone.mockResolvedValue({
      nome: "Cliente X",
      endereco: "Rua 1",
      telefone: "9999",
      userId: 10,
    });

    createPedidoRepo.create.mockImplementation(async (data: any) => ({
      id: Math.floor(Math.random() * 1000),
      ...data,
    }));

    const dto = {
      clienteTelefone: "9999",
      clienteEndereco: "Rua 1",
      itens: [
        { produtoId: 1, quantidade: 2, precoUnitario: 10 },
        { produtoId: 2, quantidade: 1, precoUnitario: 5 },
      ],
    } as any;

    const result = await sut.execute(dto);

    expect(sequelize.transaction).toHaveBeenCalledTimes(1);
    expect(findClienteByTelefoneRepo.findByTelefone).toHaveBeenCalledWith("9999");

    // total = 2*10 + 1*5 = 25
    expect(createPedidoRepo.create).toHaveBeenCalledTimes(2);

    const firstCall = createPedidoRepo.create.mock.calls[0];
    const payload1 = firstCall[0];
    const tx1 = firstCall[1];

    expect(tx1).toEqual({ id: "tx" });
    expect(payload1).toMatchObject({
      prato_id: 1,
      quantidade: 2,
      total: 25,
      status: PedidoStatusEnum.PENDENTE,
      userId: 10,
      cliente_telefone: "9999",
    });

    // código determinístico pelo Date.now mockado
    expect(payload1.codigo).toBe("PED-1700000000000");

    // retorno é array com 2 itens (um por item do pedido)
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);

    expect(logger.info).toHaveBeenCalledWith(
      "Pedido criado com sucesso",
      expect.objectContaining({
        codigo: "PED-1700000000000",
        total: 25,
        itens: 2,
        userId: 10,
      })
    );
  });

  it("deve falhar antes da transaction quando dto for inválido (itens vazio)", async () => {
    const { sut } = makeSut();

    await expect(
      sut.execute({
        clienteTelefone: "9999",
        itens: [],
      } as any)
    ).rejects.toThrow("Dados inválidos");

    expect(sequelize.transaction).not.toHaveBeenCalled();
  });

  it("deve falhar quando cliente não existir", async () => {
    const { sut, findClienteByTelefoneRepo } = makeSut();

    (sequelize.transaction as jest.Mock).mockImplementation(
      async (fn: any) => await fn({ id: "tx" })
    );

    findClienteByTelefoneRepo.findByTelefone.mockResolvedValue(null);

    await expect(
      sut.execute({
        clienteTelefone: "9999",
        itens: [{ produtoId: 1, quantidade: 1, precoUnitario: 10 }],
      } as any)
    ).rejects.toThrow("Cliente não encontrado");
  });

  it("deve falhar quando algum item tiver quantidade < 1", async () => {
    const { sut, findClienteByTelefoneRepo } = makeSut();

    (sequelize.transaction as jest.Mock).mockImplementation(
      async (fn: any) => await fn({ id: "tx" })
    );

    findClienteByTelefoneRepo.findByTelefone.mockResolvedValue({
      nome: "Cliente",
      endereco: "Rua",
      telefone: "9999",
      userId: 10,
    });

    await expect(
      sut.execute({
        clienteTelefone: "9999",
        itens: [{ produtoId: 1, quantidade: 0, precoUnitario: 10 }],
      } as any)
    ).rejects.toThrow("Item inválido");
  });
});
