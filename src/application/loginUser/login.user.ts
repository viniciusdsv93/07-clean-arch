import { InsertUserModel } from "../../domain/usecases/insert.user";
import { ILoginUser, UserModelWithToken } from "../../domain/usecases/login.user";
import { IFindUserByNameRepository } from "../protocols/find.user.name.repository";
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IUpdateUserRepository } from "../protocols/update.user.repository";

export class LoginUser implements ILoginUser {
  constructor(private readonly findUserByNameRepository: IFindUserByNameRepository,
    private readonly updateUserRepository: IUpdateUserRepository) { }

  async execute(insertLoginModel: InsertUserModel): Promise<UserModelWithToken | null> {
    const { name, password } = insertLoginModel;
    try {
      const foundUser = await this.findUserByNameRepository.find(name)

      if (!foundUser) {
        return null;
      }

      const validPassword = await compare(password, foundUser.password);

      if (!validPassword) {
        return null;
      }

      const token = jwt.sign(foundUser.id, "s3cr3t");

      const foundUserWithToken = { ...foundUser, token }

      const updatedUser = await this.updateUserRepository.update(foundUser.id, foundUserWithToken);

      return updatedUser;
    } catch (error) {
      return null;
    }
  }
}
