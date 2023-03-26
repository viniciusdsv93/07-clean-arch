import { UserModelWithToken } from "../../domain/usecases/login.user";

export interface IUpdateUserRepository {
  update(id: string, user: UserModelWithToken): Promise<UserModelWithToken>
}
