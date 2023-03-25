import { UserModel } from "src/domain/models/user";

export interface IInsertUserRepository {
  insert(user: UserModel): Promise<UserModel>
}
