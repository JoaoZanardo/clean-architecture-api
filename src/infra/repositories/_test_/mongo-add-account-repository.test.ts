import { Collection, Document } from "mongodb";
import mongoHelper from "../../../infra/helpers/mongo-helper";
import env from "../../../main/config/env";
import { MongoAddAccountRepository } from "../mongo-add-account-repository";

describe('AddAccount Repository', () => {
    let userModel: Collection<Document>;

    beforeAll(async () => {
        await mongoHelper.connect(env.mongoUrl);
        userModel = await mongoHelper.getCollection('users');
    });

    beforeEach(async () => {
        await userModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoHelper.disconnect();
    });

    it('Should create an user', async () => {
        const sut = new MongoAddAccountRepository();
        const user = await sut.add({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password: 'doe123',
        });
        expect(user).toBeTruthy();
    });
});