import { LoginUser } from "../../application/loginUser/login.user";
import { PrismaLoginUserRepository } from "../../infra/database/postgres/user-respository/login.user.repository";
import { LoginUserController } from "../../presentation/controllers/login-user.controller"

export const makeLoginController = () => {
  const updateUserRepository = new PrismaLoginUserRepository();
  const findUserByNameRepository = new PrismaLoginUserRepository();
  const loginUserService = new LoginUser(findUserByNameRepository, updateUserRepository);
  const loginController = new LoginUserController(loginUserService);
  return loginController;
}
