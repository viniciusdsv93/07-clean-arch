import { UserModel } from "src/domain/models/user";
import { IInsertUserRepository } from "../protocols/insert.user.repository";
import { InsertUserService } from "./insert.user";

describe("Insert User Service", () => {
	type SutTypes = {
		sut: InsertUserService;
		insertUserRepositoryStub: IInsertUserRepository;
	};

	const makeInserUserRepositoryStub = (): IInsertUserRepository => {
		class InsertUserRepositoryStub implements IInsertUserRepository {
			async insert(user: UserModel): Promise<UserModel> {
				return new Promise((resolve) => {
					resolve({
						id: "fake_id",
						name: "fake_name",
						password: "fake_password",
					});
				});
			}
		}

		return new InsertUserRepositoryStub();
	};

	const makeSut = (): SutTypes => {
		const insertUserRepositoryStub = makeInserUserRepositoryStub();
		const sut = new InsertUserService(insertUserRepositoryStub);
		return { sut, insertUserRepositoryStub };
	};

	test("Should return an User object with id and hashed password", async () => {
		const { sut } = makeSut();
		const result = await sut.execute({
			name: "fake_name",
			password: "fake_password",
		});
		expect(result).toHaveProperty("id");
		expect(result).toHaveProperty("name");
		expect(result).toHaveProperty("password");
		expect(result.password).not.toEqual("fake_password");
	});
});
