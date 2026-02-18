export interface FindClienteByTelefoneRepository {
  findByTelefone(telefone: string): Promise<{ userId: number; nome?: string; endereco?: string; telefone?: string } | null>;
}
