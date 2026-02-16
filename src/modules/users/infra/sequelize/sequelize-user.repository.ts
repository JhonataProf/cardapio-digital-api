import UserModel from "@/models/user-model";
import { UserEntity } from "../../domain/entities/user.entity";
import { CreateUserRepository } from "../../domain/repositories/create-user.repository";
import { FindUserByIdRepository } from "../../domain/repositories/find-user-by-id.repository";
import { FindUserByEmailRepository } from "../../domain/repositories/find-user-by-email.repository";
import { ListUsersRepository } from "../../domain/repositories/list-users.repository";
import { UpdateUserRepository } from "../../domain/repositories/update-user.repository";
import { DeleteUserRepository } from "../../domain/repositories/delete-user.repository";

export class SequelizeUserRepository
  implements
    CreateUserRepository,
    FindUserByIdRepository,
    FindUserByEmailRepository,
    ListUsersRepository,
    UpdateUserRepository,
    DeleteUserRepository
{
  async create(user: UserEntity): Promise<UserEntity> {
    const created = await UserModel.create({
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      role: user.role,
    });

    return new UserEntity({
      id: created.id,
      nome: created.nome,
      email: created.email,
      senha: created.senha,
      role: created.role,
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    return new UserEntity({
      id: user.id,
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      role: user.role,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return null;

    return new UserEntity({
      id: user.id,
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      role: user.role,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await UserModel.findAll();

    return users.map(
      (u) =>
        new UserEntity({
          id: u.id,
          nome: u.nome,
          email: u.email,
          senha: u.senha,
          role: u.role,
        })
    );
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity | null> {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    await user.update({
      nome: (data as any)?.nome ?? user.nome,
      email: (data as any)?.email ?? user.email,
      senha: (data as any)?.senha ?? user.senha,
      role: (data as any)?.role ?? user.role,
    });

    return new UserEntity({
      id: user.id,
      nome: user.nome,
      email: user.email,
      senha: user.senha,
      role: user.role,
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await UserModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
