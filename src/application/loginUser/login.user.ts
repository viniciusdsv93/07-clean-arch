import { UserModel } from "src/domain/models/user";
import { InsertUserModel } from "src/domain/usecases/insert.user";
import { ILoginUser } from "src/domain/usecases/login.user";
import { IFindUserByNameRepository } from "../protocols/find.user.name.repository";
import { compare } from 'bcrypt'

export class LoginUser implements ILoginUser {
  constructor(private readonly findUserByNameRepository: IFindUserByNameRepository) { }

  async execute(insertLoginModel: InsertUserModel): Promise<UserModel | null> {
    const { name, password } = insertLoginModel;

    const foundUser = await this.findUserByNameRepository.find(name)

    if (!foundUser) {
      return null;
    }

    const validPassword = await compare(password, foundUser.password);

    if (!validPassword) {
      return null;
    }

    return foundUser;
  }
}
