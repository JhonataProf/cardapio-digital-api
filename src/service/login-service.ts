// src/service/login-service.ts
import { logger } from "@/config/logger";
import { Encrypter, Tokenizer } from "../interfaces";
import Cliente from "../models/cliente-model";
import Funcionario from "../models/funcionario-model";
import Gerente from "../models/gerente-model";
import User from "../models/user-model";
import { LoginDTO } from "../types";

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export type PerfilTipo = "cliente" | "funcionario" | "gerente";

export interface PerfilResult {
  tipo: PerfilTipo;
  perfil: any; // Cliente | Funcionario | Gerente
  user: User;
}

export class LoginService {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly tokenizer: Tokenizer
  ) {}

  /**
   * Retorna o ID do usuário autenticado ou null quando as credenciais são inválidas.
   */
  async login({ email, senha }: LoginDTO): Promise<number | null> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      logger.info("Login failed: user not found", { email });
      return null;
    }

    const passwordField = (user as any).senha ?? (user as any).password;

    const passwordValid = await this.encrypter.compare(senha, passwordField);

    if (!passwordValid) {
      logger.info("Login failed: invalid password", {
        userId: user.id,
        email: user.email,
      });
      return null;
    }

    logger.info("Login succeeded", { userId: user.id, role: user.role });
    return user.id;
  }

  /**
   * Busca o usuário (tabela User ou perfis relacionados) a partir do e-mail.
   */
  private async findUserByEmail(email: string): Promise<User | null> {
    // 1. Tenta encontrar direto na tabela User
    const directUser = await User.findOne({ where: { email } });
    if (directUser) return directUser;

    // 2. Se o domínio usa perfis, adapte includes/where conforme seu modelo

    return null;
  }

  /**
   * Dado o ID de User, encontra qual perfil está associado (cliente, funcionário ou gerente).
   * IMPORTANTE: ajuste o nome da coluna de FK (userId) se for diferente nos seus models.
   */
  async buscarPerfilPorUserId(userId: number): Promise<PerfilResult | null> {
    // Cliente
    const cliente = await Cliente.findOne({
      where: { userId }, // ajuste aqui se a coluna for outro nome
      // include: [User], // se houver associação
    } as any);
    if (cliente) {
      const user = (cliente as any).user ?? (await User.findByPk(userId));
      if (user) {
        logger.debug("Perfil encontrado para usuário", {
          userId,
          perfil: "cliente",
        });

        return {
          tipo: "cliente",
          perfil: cliente,
          user,
        };
      }
    }

    // Funcionario
    const funcionario = await Funcionario.findOne({
      where: { userId }, // ajuste se necessário
      // include: [User],
    } as any);
    if (funcionario) {
      const user = (funcionario as any).user ?? (await User.findByPk(userId));
      if (user) {
        logger.debug("Perfil encontrado para usuário", {
          userId,
          perfil: "funcionario",
        });

        return {
          tipo: "funcionario",
          perfil: funcionario,
          user,
        };
      }
    }

    // Gerente
    const gerente = await Gerente.findOne({
      where: { userId }, // ajuste se necessário
      // include: [User],
    } as any);
    if (gerente) {
      const user = (gerente as any).user ?? (await User.findByPk(userId));
      if (user) {
        logger.debug("Perfil encontrado para usuário", {
          userId,
          perfil: "gerente",
        });

        return {
          tipo: "gerente",
          perfil: gerente,
          user,
        };
      }
    }

    logger.info("Nenhum perfil encontrado para usuário", { userId });
    return null;
  }

  /**
   * Gera tokens JWT para o usuário autenticado.
   */
  gerarTokens(user: User): AuthTokens {
    const token = this.tokenizer.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.tokenizer.generateRefreshToken({
      id: user.id,
    });

    logger.debug("Auth tokens generated", {
      userId: user.id,
      hasRefreshToken: Boolean(refreshToken),
    });

    return { token, refreshToken };
  }
}
