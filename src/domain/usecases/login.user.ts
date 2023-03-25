import { UserModel } from "../models/user";
import { InsertUserModel } from "./insert.user";

export interface ILoginUser {
  execute(insertLoginModel: InsertUserModel): Promise<UserModel | null>
}
