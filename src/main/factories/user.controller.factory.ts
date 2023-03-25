import { PrismaUserRepository } from "../../infra/database/postgres/user-respository/insert.user.repository";
import { InsertUserService } from "../../application/insertUser/insert.user";
import { UserController } from "../../presentation/controllers/insert-user.controller";

const makeUserController = () => {
  const insertUserRepository = new PrismaUserRepository();
  const insertUserService = new InsertUserService(insertUserRepository);
  const userController = new UserController(insertUserService);
  return userController;
};

export { makeUserController };
