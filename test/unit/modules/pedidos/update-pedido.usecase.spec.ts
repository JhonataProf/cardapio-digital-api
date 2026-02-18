import { UpdatePedidoUseCase } from "@/modules/pedidos/application/use-cases/update-pedido.usecase";
import { PedidoStatusEnum } from "@/modules/pedidos/domain/value-objects/pedido-status";

describe("UpdatePedidoUseCase", () => {
  const makeSut = () => {
    const findByIdRepo = {
      findById: jest.fn(),
    };

    const updateRepo = {
      update: jest.fn(),
    };

    const sut = new UpdatePedidoUseCase(findByIdRepo as any, updateRepo as any);

    return { sut, findByIdRepo, updateRepo };
  };

  beforeEach(() => jest.clearAllMocks());

  it("deve lançar erro se pedido não existir", async () => {
    const { sut, findByIdRepo, updateRepo } = makeSut();

    findByIdRepo.findById.mockResolvedValue(null);

    await expect(sut.execute(1, {} as any)).rejects.toThrow("Pedido não encontrado");

    expect(updateRepo.update).not.toHaveBeenCalled();
    expect(findByIdRepo.findById).toHaveBeenCalledWith(1);
  });

  it("deve atualizar itens e recalcular total quando patch.itens for informado", async () => {
    const { sut, findByIdRepo, updateRepo } = makeSut();

    const atual = { id: 1, status: PedidoStatusEnum.CRIADO, total: 0 };
    const atualizado = { id: 1, status: PedidoStatusEnum.CRIADO, total: 25 };

    findByIdRepo.findById
      .mockResolvedValueOnce(atual)
      .mockResolvedValueOnce(atualizado);

    const patch = {
      itens: [
        { produtoId: 1, quantidade: 2, precoUnitario: 10 },
        { produtoId: 2, quantidade: 1, precoUnitario: 5 },
      ],
    } as any;

    const result = await sut.execute(1, patch);

    expect(updateRepo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        itens: patch.itens,
        total: 25,
      })
    );

    expect(findByIdRepo.findById).toHaveBeenCalledTimes(2);
    expect(result).toEqual(atualizado);
  });

  it("deve validar transição de status e atualizar quando patch.status for válido", async () => {
    const { sut, findByIdRepo, updateRepo } = makeSut();

    const atual = { id: 1, status: PedidoStatusEnum.CRIADO };
    const atualizado = { id: 1, status: PedidoStatusEnum.PAGO };

    findByIdRepo.findById
      .mockResolvedValueOnce(atual)
      .mockResolvedValueOnce(atualizado);

    const patch = { status: PedidoStatusEnum.PAGO } as any;

    const result = await sut.execute(1, patch);

    expect(updateRepo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ status: PedidoStatusEnum.PAGO })
    );
    expect(result).toEqual(atualizado);
  });

  it("deve lançar erro quando a transição de status for inválida", async () => {
    const { sut, findByIdRepo, updateRepo } = makeSut();

    // ENVIADO não aceita nada (Set vazio)
    const atual = { id: 1, status: PedidoStatusEnum.ENVIADO };

    findByIdRepo.findById.mockResolvedValueOnce(atual);

    await expect(
      sut.execute(1, { status: PedidoStatusEnum.PAGO } as any)
    ).rejects.toThrow(/Transição inválida/);

    expect(updateRepo.update).not.toHaveBeenCalled();
    // não chega no "return await findById" final quando explode
    expect(findByIdRepo.findById).toHaveBeenCalledTimes(1);
  });

  it("não deve chamar updateRepo.update quando patch não altera nada", async () => {
    const { sut, findByIdRepo, updateRepo } = makeSut();

    const atual = { id: 1, status: PedidoStatusEnum.CRIADO };
    findByIdRepo.findById
      .mockResolvedValueOnce(atual)
      .mockResolvedValueOnce(atual);

    const result = await sut.execute(1, {} as any);

    expect(updateRepo.update).not.toHaveBeenCalled();
    expect(findByIdRepo.findById).toHaveBeenCalledTimes(2);
    expect(result).toEqual(atual);
  });
});
