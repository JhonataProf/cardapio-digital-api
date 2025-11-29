import { AppError } from "@/shared/errors-app-error";

export const userNotFound = (id: number) =>
  new AppError(
    "USER_NOT_FOUND",
    `Usuário com id ${id} não foi encontrado`,
    404,
    { id }
  );

export const emailAlreadyInUse = (email: string) =>
  new AppError(
    "EMAIL_ALREADY_IN_USE",
    `O e-mail ${email} já está em uso`,
    409,
    { email }
  );
