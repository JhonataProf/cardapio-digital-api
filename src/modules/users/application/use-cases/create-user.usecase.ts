import { CreateUserRepository } from "@/modules/users/domain/repositories/create-user.repository";
import { FindUserByEmailRepository } from "@/modules/users/domain/repositories/find-user-by-email.repository";
import { UserEntity } from "@/modules/users/domain/entities/user.entity";
import { CreateUserDTO } from "@/types/usuarios";
import { Encrypter } from "@/interfaces";
import { emailAlreadyInUse } from "@/modules/users/domain/errors/user-errors";
import { DomainLogger, NoopDomainLogger } from "@/shared/logger/domain-logger";

export class CreateUserUseCase {
  constructor(
    private readonly createUserRepo: CreateUserRepository,
    private readonly findByEmailRepo: FindUserByEmailRepository,
    private readonly encrypter: Encrypter,
    private readonly logger: DomainLogger = new NoopDomainLogger()
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserEntity> {
    this.logger.info("Iniciando CreateUserUseCase", {
      email: dto.email,
      role: dto.role,
    });

    const existing = await this.findByEmailRepo.findByEmail(dto.email);

    if (existing) {
      this.logger.info("Email já está em uso", { email: dto.email });
      throw emailAlreadyInUse(dto.email);
    }

    const hashed = await this.encrypter.hash(dto.senha);

    const user = new UserEntity({
      id: 0, // vai ser setado pelo repo
      nome: dto.nome,
      email: dto.email,
      senha: hashed,
      role: dto.role,
    });

    const created = await this.createUserRepo.create(user);

    this.logger.info("Usuário criado com sucesso", {
      userId: created.id,
      email: created.email,
      role: created.role,
    });

    return created;
  }
}
