export interface DeleteUserRepository {
  delete(id: number): Promise<boolean>;
}