import sequelize from "@/core/database";
import { DomainLogger, NoopDomainLogger } from "@/core/logger/domain-logger";
import { PedidoStatusEnum } from "../../domain/value-objects/pedido-status"; // depois a gente realoca p/ módulo
import { CreatePedidoDTO } from "../dto/create-pedido.dto";
import { FindClienteByTelefoneRepository } from "../../../users/domain/repositories/find-cliente-by-telefone.repository";
import { CreatePedidoRepository } from "../../domain/repositories/create-pedido.repository";

export class CreatePedidoUseCase {
  constructor(
    private readonly findClienteByTelefoneRepo: FindClienteByTelefoneRepository,
    private readonly createPedidoRepo: CreatePedidoRepository,
    private readonly logger: DomainLogger = new NoopDomainLogger()
  ) {}

  async execute(dto: CreatePedidoDTO) {
    this.validate(dto);

    const pedidoCod = `PED-${Date.now()}`;
    const total = this.calcularTotal(dto.itens);

    return await sequelize.transaction(async (t) => {
      const cliente = await this.findClienteByTelefoneRepo.findByTelefone(dto.clienteTelefone);

      if (!cliente) {
        // Aqui você decide a regra:
        // 1) ou cria Cliente via Users module (ACL) -> recomendado
        // 2) ou lança erro de domínio
        throw new Error("Cliente não encontrado"); // depois trocamos por AppError
      }

      // IMPORTANTE: não use forEach async.
      const created = await Promise.all(
        dto.itens.map(async (item) => {
          if (item.quantidade < 1) throw new Error("Quantidade do item deve ser pelo menos 1");

          const novoPedido = {
            cliente_nome: cliente.nome ?? "Cliente",
            cliente_endereco: cliente.endereco ?? dto.clienteEndereco ?? "Endereço não informado",
            cliente_telefone: cliente.telefone ?? dto.clienteTelefone,
            prato_id: item.produtoId,
            quantidade: item.quantidade,
            codigo: pedidoCod,
            userId: cliente.userId,
            total,
            status: PedidoStatusEnum.PENDENTE, // status inicial do pedido
          };

          return await this.createPedidoRepo.create(novoPedido, t);
        })
      );

      this.logger.info("Pedido criado com sucesso", {
        codigo: pedidoCod,
        total,
        itens: dto.itens.length,
        userId: cliente.userId,
      });

      return created;
    });
  }

  private validate(dto: CreatePedidoDTO) {
    if (!Array.isArray(dto.itens) || dto.itens.length === 0) throw new Error("Dados inválidos");
    dto.itens.forEach((i) => {
      if (!i.produtoId || i.quantidade < 1 || i.precoUnitario < 0) throw new Error("Item inválido");
    });
    if (!dto.clienteTelefone) throw new Error("clienteTelefone é obrigatório");
  }

  private calcularTotal(itens: { quantidade: number; precoUnitario: number }[]) {
    return itens.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0);
  }
}
