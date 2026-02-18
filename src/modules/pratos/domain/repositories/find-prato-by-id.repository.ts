export interface FindPratoByIdRepository {
  findById(id: number): Promise<{ id: number } | null>;
}