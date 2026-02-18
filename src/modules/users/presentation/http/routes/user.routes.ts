import { Router } from "express";
import adaptRoute from "@/core/adapters/express-route-adapter";

import authMiddleware from "@/core/http/middlewares/auth-middleware";
import authorizeRoles from "@/core/http/middlewares/authorize-roles";
import { validateBody } from "@/core/http/middlewares/validate-body";

import { createUserSchema, updateUserSchema } from "../validators/user-schemas";

import { CreateUserController } from "../controllers/create-user.controller";
import { ListUsersController } from "../controllers/list-users.controller";
import { GetUserByIdController } from "../controllers/get-user-by-id.controller";
import { UpdateUserController } from "../controllers/update-user.controller";
import { DeleteUserController } from "../controllers/delete-user.controller";

import { CreateUserUseCase } from "@/modules/users/application/use-cases/create-user.usecase";
import { ListUsersUseCase } from "@/modules/users/application/use-cases/list-users.usecase";
import { GetUserByIdUseCase } from "@/modules/users/application/use-cases/get-user-by-id.usecase";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/update-user.usecase";
import { DeleteUserUseCase } from "@/modules/users/application/use-cases/delete-user.usecase";

import { SequelizeUserRepository } from "@/modules/users/infra/sequelize/sequelize-user.repository";

import { BcryptAdapter } from "@/core/adapters/bcrypt-adapter";
import { logger } from "@/core/config/logger";

export function registerUserRoutes(router: Router): void {
  const userRepo = new SequelizeUserRepository();
  const encrypter = new BcryptAdapter(12);

  const createUserUseCase = new CreateUserUseCase(
  userRepo,
  userRepo,
  encrypter
);

  const listUsersUseCase = new ListUsersUseCase(userRepo);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepo);
  const updateUserUseCase = new UpdateUserUseCase(userRepo, userRepo, encrypter);
  const deleteUserUseCase = new DeleteUserUseCase(userRepo, userRepo);

  const createUserController = new CreateUserController(createUserUseCase);
  const listUsersController = new ListUsersController(listUsersUseCase);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
  const updateUserController = new UpdateUserController(updateUserUseCase);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  // 🔐 Proteção: crie usuário só com Gerente (ajuste como você quiser)
  router.post(
    "/usuarios",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    validateBody(createUserSchema),
    adaptRoute(createUserController)
  );

  router.get(
    "/usuarios",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(listUsersController)
  );

  router.get(
    "/usuarios/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(getUserByIdController)
  );

  router.put(
    "/usuarios/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    validateBody(updateUserSchema),
    adaptRoute(updateUserController)
  );

  router.delete(
    "/usuarios/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(deleteUserController)
  );
}
