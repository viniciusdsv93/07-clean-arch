import { UserModel } from "src/domain/models/user";
import { IFindUserByNameRepository } from "../protocols/find.user.name.repository";
import { LoginUser } from "./login.user";

describe("Login User Service", () => {
  type SutTypes = {
    sut: LoginUser;
    findUserByNameRepositoryStub: IFindUserByNameRepository
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

  const makeSut = (): SutTypes => {
    const findUserByNameRepositoryStub = makeFindUserByNameRepositoryStub();
    const sut = new LoginUser(findUserByNameRepositoryStub);
    return { sut, findUserByNameRepositoryStub };
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
