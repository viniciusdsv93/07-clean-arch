import { UserModel } from "../models/user";
import { InsertUserModel } from "./insert.user";

type Token = {
  token: string;
}

export type UserModelWithToken = UserModel & Token;

export interface ILoginUser {
  execute(insertLoginModel: InsertUserModel): Promise<UserModelWithToken | null>
}
