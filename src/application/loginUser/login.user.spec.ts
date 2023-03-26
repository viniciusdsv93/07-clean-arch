import { UserModel } from "src/domain/models/user";
import { IFindUserByNameRepository } from "../protocols/find.user.name.repository";
import { LoginUser } from "./login.user";
import { IUpdateUserRepository } from "../protocols/update.user.repository";
import { UserModelWithToken } from "src/domain/usecases/login.user";

describe("Login User Service", () => {
  type SutTypes = {
    sut: LoginUser;
    findUserByNameRepositoryStub: IFindUserByNameRepository
    updateUserRepositoryStub: IUpdateUserRepository
  };

  const makeFindUserByNameRepositoryStub = (): IFindUserByNameRepository => {
    class FindUserByNameRepositoryStub implements IFindUserByNameRepository {
      async find(name: string): Promise<UserModel | null> {
        return new Promise(resolve => resolve({
          id: "fake_id",
          name: "fake_name",
          password: "fake_password"
        }))
      }
    }
    return new FindUserByNameRepositoryStub()
  }


  const makeUpdateUserRepositoryStub = (): IUpdateUserRepository => {
    class UpdateUserRepositoryStub implements IUpdateUserRepository {
      update(id: string, user: UserModelWithToken): Promise<UserModelWithToken> {
        return new Promise(resolve => resolve({
          id: "fake_id",
          name: "fake_name",
          password: "fake_password",
          token: "fake_token"
        }))
      }
    }

    return new UpdateUserRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    const updateUserRepositoryStub = makeUpdateUserRepositoryStub();
    const findUserByNameRepositoryStub = makeFindUserByNameRepositoryStub();
    const sut = new LoginUser(findUserByNameRepositoryStub, updateUserRepositoryStub);
    return { sut, findUserByNameRepositoryStub, updateUserRepositoryStub };
  };

  test("Should call FindUserByNameRepository with correct values", async () => {
    const { sut, findUserByNameRepositoryStub } = makeSut();
    const findUserByNameRepositoryStubSpy = jest.spyOn(findUserByNameRepositoryStub, "find");
    await sut.execute({
      name: "fake_name",
      password: "fake_password",
    });
    expect(findUserByNameRepositoryStubSpy).toHaveBeenCalledWith("fake_name")
  });


  test("Should return null if FindUserByNameRepository returns null", async () => {
    const { sut, findUserByNameRepositoryStub } = makeSut();
    jest.spyOn(findUserByNameRepositoryStub, "find").mockImplementationOnce(() => {
      return new Promise(resolve => resolve(null))
    })
    const result = await sut.execute({
      name: "fake_name",
      password: "fake_password",
    });
    expect(result).toBeNull()
  });
});
