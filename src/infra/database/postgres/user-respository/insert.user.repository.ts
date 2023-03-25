import { IInsertUserRepository } from "src/application/protocols/insert.user.repository";
import { prismaClient } from "../prisma/prisma.client";
import { UserModel } from "src/domain/models/user";

export class PrismaUserRepository implements IInsertUserRepository {

  async insert(user: UserModel): Promise<UserModel> {
    const insertedUser = await prismaClient.user.create({
      data: user
    });
    return insertedUser;
  }
}
