import { UserModel } from "src/domain/models/user";

export interface IFindUserByNameRepository {
  find(name: string): Promise<UserModel | null>
}
