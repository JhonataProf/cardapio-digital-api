import { Tokenizer } from "@/core/adapters/token-adapter";
import { Encrypter } from "@/core/interfaces";
import Cliente from "../models/cliente-model";
import Funcionario from "../models/funcionario-model";
import Gerente from "../models/gerente-model";
import User from "../models/user-model";
import { LoginDTO } from "../types";

export class LoginService {
  private readonly encrypter;
  private readonly tokenizer;
  public constructor(encrypter: Encrypter, tokenizer: Tokenizer) {
    this.encrypter = encrypter;
    this.tokenizer = tokenizer;
  }
  async login({ email, senha }: LoginDTO): Promise<null | number> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    // Comparar a senha recebida com a senha criptografada
    const senhaEhValida = await this.encrypter.compare(senha, user.senha);
    if (!senhaEhValida) {
      return null;
    }
    return user.id;
  }

  async buscarPerfilPorUserId(
    userId: number
  ): Promise<null | Cliente | Funcionario | Gerente> {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    if (user.role === "Funcionario") {
      return await Funcionario.findOne({
        where: { userId },
        include: [{ model: User, as: "user" }],
      });
    } else if (user.role === "Cliente") {
      return await Cliente.findOne({
        where: { userId },
        include: [{ model: User, as: "user" }],
      });
    } else if (user.role === "Gerente") {
      return await Gerente.findOne({
        where: { userId },
        include: [{ model: User, as: "user" }],
      });
    }
    return null;
  }

  gerarTokens(user: User) {
    const token = this.tokenizer.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = this.tokenizer.generateRefreshToken({ id: user.id });
    return { token, refreshToken };
  }
}
