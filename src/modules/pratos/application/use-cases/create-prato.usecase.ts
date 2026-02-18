import { CreatePratoDTO } from "../dto/create-prato.dto";
import { CreatePratoRepository } from "../../domain/repositories/create-prato.repository";

export class CreatePratoUseCase {
  constructor(private readonly repo: CreatePratoRepository) {}

  async execute(dto: CreatePratoDTO) {
    // aqui você pode colocar regras de domínio (ex: valor > 0)
    return this.repo.create(dto);
  }
}
