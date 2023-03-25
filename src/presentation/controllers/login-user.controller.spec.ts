import { ILoginUser } from "src/domain/usecases/login.user";
import { LoginUserController } from "./login-user.controller";
import { UserModel } from "src/domain/models/user";
import { InsertUserModel } from "src/domain/usecases/insert.user";

describe("Login User Controller", () => {
  type SutTypes = {
    sut: LoginUserController;
    loginUserStub: ILoginUser;
  };

  const makeLoginUserStub = (): ILoginUser => {
    class LoginUserStub implements ILoginUser {
      async execute(insertLoginModel: InsertUserModel): Promise<UserModel | null> {
        return new Promise(resolve => resolve({
          id: "fake_id",
          name: "fake_name",
          password: "fake_password"
        }))
      }
    }
    return new LoginUserStub();
  }
  const makeSut = (): SutTypes => {
    const loginUserStub = makeLoginUserStub();
    const sut = new LoginUserController(loginUserStub);

    return { sut, loginUserStub };
  };

  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        password: "fake_password",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({ statusCode: 400, message: "name is a required field" });
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        name: "fake_name",
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 400,
      message: "password is a required field",
    });
  });


  test("Should call LoginUserService with correct values", async () => {
    const { sut, loginUserStub } = makeSut();
    const loginUserStubSpy = jest.spyOn(loginUserStub, "execute")
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "fake_password"
      },
    };
    await sut.handle(fakeRequest);
    expect(loginUserStubSpy).toHaveBeenCalledWith({
      name: "fake_name",
      password: "fake_password"
    })
  });


  test("Should return 403 if LoginUserService returns null", async () => {
    const { sut, loginUserStub } = makeSut();
    jest.spyOn(loginUserStub, "execute").mockImplementationOnce(() => {
      return new Promise(resolve => {
        resolve(null)
      })
    })
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "incorrect_password"
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 403,
      message: "Invalid credentials"
    })
  });


  test("Should return 200 on LoginUserService success", async () => {
    const { sut } = makeSut();
    const fakeRequest = {
      body: {
        name: "fake_name",
        password: "fake_password"
      },
    };
    const result = await sut.handle(fakeRequest);
    expect(result).toEqual({
      statusCode: 200,
      message: "Access granted"
    })
  });

  // test("Should return 200 on success", async () => {
  //   const { sut } = makeSut();
  //   const fakeRequest = {
  //     body: {
  //       name: "fake_name",
  //       password: "fake_password",
  //       password_confirmation: "fake_password",
  //     },
  //   };
  //   const result = await sut.handle(fakeRequest);
  //   expect(result).toEqual({
  //     statusCode: 201,
  //     message: "User successfully inserted",
  //     user: {
  //       id: "fake_id",
  //       name: "fake_name",
  //       password: "fake_password",
  //     },
  //   });
  // });
});
