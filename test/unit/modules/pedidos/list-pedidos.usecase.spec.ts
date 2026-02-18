import { ListPedidosUseCase } from "@/modules/pedidos/application/use-cases/list-pedidos.usecase";

describe("ListPedidosUseCase", () => {
  const makeSut = () => {
    const repo = {
      list: jest.fn(),
    };

    const sut = new ListPedidosUseCase(repo as any);
    return { sut, repo };
  };

  it("deve retornar lista de pedidos", async () => {
    const { sut, repo } = makeSut();

    repo.list.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await sut.execute();

    expect(repo.list).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("deve retornar lista vazia quando não houver pedidos", async () => {
    const { sut, repo } = makeSut();

    repo.list.mockResolvedValue([]);

    const result = await sut.execute();

    expect(repo.list).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it("deve propagar erro do repositório", async () => {
    const { sut, repo } = makeSut();

    repo.list.mockRejectedValue(new Error("DB error"));

    await expect(sut.execute()).rejects.toThrow("DB error");
  });
});
