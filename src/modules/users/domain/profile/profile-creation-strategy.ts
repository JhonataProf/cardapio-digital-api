import { UserEntity } from "@/modules/users/domain/entities/user.entity";

export interface ProfileCreationContext {
  user: UserEntity;
  // aqui você coloca campos específicos pra cada perfil
  // por exemplo, se no DTO de criação de usuário já vem algo de perfil:
  // clienteTelefone?: string;
  // clienteEndereco?: string;
  // departamento?: string;
  // etc.
  payload: any;
}

export interface ProfileCreationStrategy {
  createProfile(context: ProfileCreationContext): Promise<void>;
}
