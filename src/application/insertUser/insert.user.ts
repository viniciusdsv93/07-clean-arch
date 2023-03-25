import { UserModel } from "src/domain/models/user";
import { IInsertUser, InsertUserModel } from "src/domain/usecases/insert.user";
import { v4 as uuid } from "uuid";
import { hash } from "bcrypt";
import { IInsertUserRepository } from "../protocols/insert.user.repository";

export class InsertUserService implements IInsertUser {

  constructor(private readonly insertUserRepository: IInsertUserRepository) { }

  async execute(insertUserModel: InsertUserModel): Promise<UserModel> {
    const { name, password } = insertUserModel;
    const id = uuid();
    const hashedPassword = await hash(password, 10);
    const newUser: UserModel = {
      id,
      name,
      password: hashedPassword,
    };

    await this.insertUserRepository.insert(newUser);
    return newUser;
  }
}
