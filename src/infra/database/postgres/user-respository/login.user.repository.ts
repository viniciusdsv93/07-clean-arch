import { prismaClient } from "../prisma/prisma.client";
import { UserModel } from "src/domain/models/user";
import { IFindUserByNameRepository } from "src/application/protocols/find.user.name.repository";

export class PrismaLoginUserRepository implements IFindUserByNameRepository {
  async find(name: string): Promise<UserModel | null> {
    return await prismaClient.user.findFirst({
      where: {
        name
      }
    })
  }
}
