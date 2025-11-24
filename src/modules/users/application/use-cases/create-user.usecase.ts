import { CreateUserRepository } from "../../domain/repositories/create-user.repository";
import { FindUserByEmailRepository } from "../../domain/repositories/find-user-by-email.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { Encrypter } from "@/interfaces";
import { logger } from "@/config/logger";
import { CreateUserDTO } from "@/types/usuarios"; // ajuste o nome se for diferente

export class CreateUserUseCase {
  constructor(
    private readonly createUserRepo: CreateUserRepository,
    private readonly findByEmailRepo: FindUserByEmailRepository,
    private readonly encrypter: Encrypter
  ) {}

  async execute(input: CreateUserDTO): Promise<UserEntity> {
    const existing = await this.findByEmailRepo.findByEmail(input.email);
    if (existing) {
      logger.info("CreateUserUseCase: email já cadastrado", {
        email: input.email,
      });
      // depois pode virar um DomainError
      throw new Error("EMAIL_ALREADY_IN_USE");
    }

    const hashedPassword = await this.encrypter.hash(input.senha);

    const userEntity = new UserEntity({
      nome: input.nome,
      email: input.email,
      senha: hashedPassword,
      role: input.role,
    });

    const created = await this.createUserRepo.create(userEntity);

    logger.info("CreateUserUseCase: usuário criado", { userId: created.id });

    return created;
  }
}
