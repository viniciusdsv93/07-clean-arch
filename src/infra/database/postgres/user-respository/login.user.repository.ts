import { prismaClient } from "../prisma/prisma.client";
import { UserModel } from "../../../../domain/models/user";
import { IFindUserByNameRepository } from "../../../../application/protocols/find.user.name.repository";
import { IUpdateUserRepository } from "../../../../application/protocols/update.user.repository";
import { UserModelWithToken } from "../../../../domain/usecases/login.user";

export class PrismaLoginUserRepository implements IFindUserByNameRepository, IUpdateUserRepository {
  async find(name: string): Promise<UserModel | null> {
    return await prismaClient.user.findFirst({
      where: {
        name
      }
    })
  }

  async update(id: string, user: UserModelWithToken): Promise<UserModelWithToken> {
    const updatedUser = await prismaClient.user.update({
      where: {
        id: id
      },
      data: user
    })
    return updatedUser;
  }
}
