import { GetPedidoByIdUseCase } from "@/modules/pedidos/application/use-cases/get-pedido-by-id.usecase";

describe("GetPedidoByIdUseCase", () => {
  const makeSut = () => {
    const repo = {
      findById: jest.fn(),
    };

    const sut = new GetPedidoByIdUseCase(repo as any);
    return { sut, repo };
  };

  it("deve retornar o pedido quando encontrado", async () => {
    const { sut, repo } = makeSut();

    repo.findById.mockResolvedValue({
      id: 1,
      status: "CRIADO",
    });

    const result = await sut.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, status: "CRIADO" });
  });

  it("deve lançar erro quando não encontrado", async () => {
    const { sut, repo } = makeSut();

    repo.findById.mockResolvedValue(null);

    await expect(sut.execute(999)).rejects.toThrow("Pedido não encontrado");
    expect(repo.findById).toHaveBeenCalledWith(999);
  });
});
