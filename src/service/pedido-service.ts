import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import Cliente from "@/models/cliente-model";
import { StatusPedido } from "../enums/status-pedido";
import PedidoModel from "../models/pedido-model";
import { CreatePedidoDTO, PedidoItemDTO, UpdatePedidoDTO } from "../types";
import { UsuarioService } from "./usuario-service";

export class PedidoService {
  async createPedido(dto: CreatePedidoDTO) {
    if (!Array.isArray(dto.itens) || !dto.itens.length) {
      throw new Error("Dados inválidos");
    }
    dto.itens.forEach((i) => {
      if (!i.produtoId || i.quantidade < 1 || i.precoUnitario < 0)
        throw new Error("Item inválido");
    })
    let cliente = await Cliente.findOne({
      where: { telefone: dto.clienteTelefone },
    });
    if (!cliente) {
      const encrypter = new BcryptAdapter(12);
      const usuarioService = new UsuarioService(encrypter);
      const dtoCliente = await usuarioService.criarUsuario({
        nome: `Cliente_${Date.now()}`,
        email: `cliente_${Date.now()}@senac.dou.com`,
        telefone: dto.clienteTelefone,
        senha: "cliente123",
        role: "Cliente",
      });
      cliente = await usuarioService.__buscarPerfilPorUserId(dtoCliente.id) as Cliente;
    }
    if (!cliente) {
      throw new Error("Erro ao criar cliente");
    }
    const pedidoCod = `PED-${Date.now()}`;
    const total = this.__calcularTotal(dto.itens);
    const created = dto.itens.forEach(async (pedidoItem) => {
      if (pedidoItem.quantidade < 1) {
        throw new Error("Quantidade do item deve ser pelo menos 1");
      }
      const novoPedido = {
        cliente_nome: cliente?.nome ? cliente.nome : "Cliente",
        cliente_endereco: cliente?.endereco
          ? cliente.endereco
          : "Endereço não informado",
        cliente_telefone: cliente?.telefone || dto.clienteTelefone,
        prato_id: pedidoItem.produtoId,
        quantidade: pedidoItem.quantidade,
        codigo: pedidoCod,
        userId: cliente.userId,
        total: total,
        status: StatusPedido.CRIADO,
      };
      return await (PedidoModel as any).create(novoPedido);
    });
    return created;
  }
  async getPedidos() {
    return (
      (await (PedidoModel as any).findAll?.()) ??
      (await (PedidoModel as any).find?.())
    );
  }

  async getPedidoById(id: string) {
    const byPk = (PedidoModel as any).findByPk || (PedidoModel as any).findById;
    const p = byPk ? await byPk.call(PedidoModel, id) : null;
    if (!p) throw new Error("Pedido não encontrado");
    return p;
  }
  async updatePedido(id: string, patch: UpdatePedidoDTO) {
    const atual: any = await this.getPedidoById(id);
    const dados: any = {};
    if (patch.itens && patch.itens.length) {
      dados.itens = patch.itens;
      dados.total = this.__calcularTotal(patch.itens);
    }
    if (patch.status) {
      this.__validarTransicaoStatus(
        atual.status as StatusPedido,
        patch.status as StatusPedido
      );
      dados.status = patch.status;
    }
    if (Object.keys(dados).length) {
      if ((PedidoModel as any).update) {
        await (PedidoModel as any).update(dados, { where: { id } });
      } else if ((PedidoModel as any).findByIdAndUpdate) {
        await (PedidoModel as any).findByIdAndUpdate(id, dados, { new: true });
      }
    }
    return await this.getPedidoById(id);
  }
  async deletePedido(id: string) {
    const destroyed = (PedidoModel as any).destroy
      ? await (PedidoModel as any).destroy({ where: { id } })
      : await (PedidoModel as any).findByIdAndDelete?.(id);
    if (!destroyed) throw new Error("Pedido não encontrado");
  }
  __calcularTotal(itens: PedidoItemDTO[] = []): number {
    return itens.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0);
  }
  __validarTransicaoStatus(atual: StatusPedido, novo: StatusPedido) {
    const mapa: Record<StatusPedido, Set<StatusPedido>> = {
      [StatusPedido.CRIADO]: new Set([
        StatusPedido.PAGO,
        StatusPedido.CANCELADO,
      ]),
      [StatusPedido.PAGO]: new Set([
        StatusPedido.ENVIADO,
        StatusPedido.CANCELADO,
      ]),
      [StatusPedido.ENVIADO]: new Set(),
      [StatusPedido.CANCELADO]: new Set(),
    } as any;
    if (!mapa[atual]?.has(novo))
      throw new Error(`Transição inválida de ${atual} para ${novo}`);
  }
}
