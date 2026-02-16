import { UserEntity } from "../entities/user.entity";

export interface FindUserByIdRepository {
  findById(id: number): Promise<UserEntity | null>;
}
