import { DeletePedidoUseCase } from "@/modules/pedidos/application/use-cases/delete-pedido.usecase";

describe("DeletePedidoUseCase", () => {
  const makeSut = () => {
    const repo = {
      delete: jest.fn(),
    };

    const sut = new DeletePedidoUseCase(repo as any);
    return { sut, repo };
  };

  it("deve chamar repo.delete e retornar true", async () => {
    const { sut, repo } = makeSut();

    repo.delete.mockResolvedValue(true);

    const result = await sut.execute(1);

    expect(repo.delete).toHaveBeenCalledWith(1);
    // seu use-case atualmente SEMPRE retorna true
    expect(result).toBe(true);
  });

  it("mesmo se repo.delete retornar false, ainda retorna true (comportamento atual)", async () => {
    const { sut, repo } = makeSut();

    repo.delete.mockResolvedValue(false);

    const result = await sut.execute(999);

    expect(repo.delete).toHaveBeenCalledWith(999);
    expect(result).toBe(true);
  });

  it("deve propagar erro do repo", async () => {
    const { sut, repo } = makeSut();

    repo.delete.mockRejectedValue(new Error("DB error"));

    await expect(sut.execute(1)).rejects.toThrow("DB error");
  });
});
