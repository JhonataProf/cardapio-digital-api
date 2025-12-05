import sequelize from "../database";
import { Role } from "../enums/role";
import { Encrypter } from "../interfaces";
import Cliente from "../models/cliente-model";
import Funcionario from "../models/funcionario-model";
import Gerente from "../models/gerente-model";
import User from "../models/user-model";
import { CreateUserDTO, ResponseCreateUserDto } from "../types";

export class UsuarioService {
  private readonly encrypter: Encrypter;
  public constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }
  async deletarUsuario(id: number): Promise<boolean> {
    const result = sequelize.transaction(async (t) => {
      const perfil = await this.__buscarPerfilPorUserId(id);
      if (!perfil) {
        return false;
      }
      const user = await User.findByPk(id);
      if (!user) {
        return false;
      }
      await perfil.destroy({ transaction: t });
      await user.destroy({ transaction: t });
      return true;
    });
    return result;
  }

  async buscarUsuarioPorId(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async buscarPorEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async buscaTodosUsuarios(): Promise<User[]> {
    return (await User.findAll()).map((user) => user?.toJSON());
  }

  async atualizarUsuario(
    id: number,
    { nome, email, senha }: { nome?: string; email?: string; senha?: string }
  ): Promise<User | null> {
    const user = await User.findByPk(id);
    const newUser = { ...user?.toJSON() };
    if (!user) {
      return null;
    }
    const senhaCriptografada = senha
      ? await this.encrypter.hash(senha)
      : user.senha;
    newUser.nome = nome || newUser.nome;
    newUser.email = email || newUser.email;
    newUser.senha = senha ? senhaCriptografada : newUser.senha;
    const userAtualizado = await sequelize.transaction(async (t) => {
      const perfil = await this.__buscarPerfilPorUserId(id);
      if (perfil && nome) {
        await perfil.update({ nome }, { transaction: t });
      }
      return await user.update(newUser, { transaction: t });
    });
    return userAtualizado.toJSON();
  }

  async criarUsuario(
    dadosUsuario: CreateUserDTO
  ): Promise<ResponseCreateUserDto> {
    const { nome, email, senha, role } = dadosUsuario;
    const senhaCriptografada = await this.encrypter.hash(senha);

    const usuario = await User.create({
      nome,
      email,
      senha: senhaCriptografada,
      role,
    });
    await this.__criarPerfil({ userId: usuario.id, role, nome, telefone: dadosUsuario?.telefone });
    await User.sync();
    const usuarioCriado = await User.findByPk(usuario.id);
    if(!usuarioCriado) {
      throw new Error("Erro ao criar usuário");
    }
    return {
      id: usuarioCriado?.id,
      nome: usuarioCriado?.nome,
      email: usuarioCriado.email,
      role: usuarioCriado?.role,
      telefone: dadosUsuario.telefone,
    };

  }

  async __buscarPerfilPorUserId(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    if (user.role === "Funcionario") {
      return Funcionario.findOne({
        where: { userId },
        include: [{ model: User, as: "user" }],
      });
    } else if (user.role === "Cliente") {
      return Cliente.findOne({
        where: { userId },
        include: [{ model: User, as: "user" }],
      });
    } else if (user.role === "Gerente") {
      return Gerente.findOne({
        where: { userId },
        include: [{ model: User, as: "user" }],
      });
    }
    return null;
  }

  async __criarPerfil({
    userId,
    role,
    nome,
    telefone,
  }: {
    userId: number;
    role: string;
    nome: string;
    telefone?: string;
  }) {
    if (role === Role.CLIENTE) {
      await Cliente.create({
        nome,
        userId,
        telefone,
      });
    } else if (role === Role.FUNCIONARIO) {
      await Funcionario.create({
        nome,
        userId,
      });
    } else if (role === Role.GERENTE) {
      await Gerente.create({
        nome,
        userId,
      });
    }
  }

  async validarUsuarioExistente(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    return !!user;
  }
}
