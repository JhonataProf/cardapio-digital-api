import { PedidoStatusEnum, PedidoStatus } from "../../domain/value-objects/pedido-status";
import { UpdatePedidoDTO } from "../dto/update-pedido.dto";
import { FindPedidoByIdRepository } from "../../domain/repositories/find-pedido-by-id.repository";
import { UpdatePedidoRepository } from "../../domain/repositories/update-pedido.repository";

export class UpdatePedidoUseCase {
  constructor(
    private readonly findByIdRepo: FindPedidoByIdRepository,
    private readonly updateRepo: UpdatePedidoRepository
  ) {}

  async execute(id: number, patch: UpdatePedidoDTO) {
    const atual = await this.findByIdRepo.findById(id);
    if (!atual) throw new Error("Pedido não encontrado");

    const dados: any = {};

    if (patch.itens?.length) {
      dados.itens = patch.itens;
      dados.total = patch.itens.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0);
    }

    if (patch.status) {
      this.validarTransicaoStatus(atual.status satisfies PedidoStatus, patch.status);
      dados.status = patch.status;
    }

    if (Object.keys(dados).length) await this.updateRepo.update(id, dados);

    return await this.findByIdRepo.findById(id);
  }

  private validarTransicaoStatus(atual: PedidoStatus, novo: PedidoStatus) {
    const mapa: Record<PedidoStatus, Set<PedidoStatus>> = {
      [PedidoStatusEnum.CRIADO]: new Set([PedidoStatusEnum.PAGO, PedidoStatusEnum.CANCELADO]),
      [PedidoStatusEnum.PAGO]: new Set([PedidoStatusEnum.ENVIADO, PedidoStatusEnum.CANCELADO]),
      [PedidoStatusEnum.ENVIADO]: new Set(),
      [PedidoStatusEnum.CANCELADO]: new Set(),
    } as any;

    if (!mapa[atual]?.has(novo)) throw new Error(`Transição inválida de ${atual} para ${novo}`);
  }
}
