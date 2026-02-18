import { CreatePratoRepository } from "../../domain/repositories/create-prato.repository";

export class SequelizePratoRepository implements CreatePratoRepository {
  async create(data: any): Promise<any> {
    // Lógica para criar um prato usando Sequelize
    // Exemplo:
    // return PratoModel.create(data);
    return { id: 1, ...data }; // Simulação de prato criado
  }
}