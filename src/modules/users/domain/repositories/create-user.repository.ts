import { UserEntity } from "../entities/user.entity";

export interface CreateUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
}
