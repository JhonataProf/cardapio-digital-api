import { UserEntity } from "../entities/user.entity";

export interface ListUsersRepository {
  findAll(): Promise<UserEntity[]>;
}