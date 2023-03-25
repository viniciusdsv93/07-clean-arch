import { UserModel } from "../models/user";

export type InsertUserModel = Omit<UserModel, "id">;

export interface IInsertUser {
	execute: (insertUserModel: InsertUserModel) => Promise<UserModel>;
}
