import { Collection, Document } from "mongodb";
import mongoHelper from "../helpers/mongo-helper";
import { DbUpdateAccessTokenRepository } from "./update-access-token-repository";

const makeSut = (userModel: Collection<Document>) => {
    return new DbUpdateAccessTokenRepository(userModel);
};

describe('UpdateAccessToken Repository', () => {
    let userModel: Collection<Document>;

    beforeAll(async () => {
        await mongoHelper.connect(process.env.MONGO_URL as string);
        userModel = await mongoHelper.getCollection('users');
    });

    beforeEach(async () => {
        await userModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoHelper.disconnect();
    });

    test('Should update the user with the given token', async () => {
        const sut = makeSut(userModel)
        const user = await userModel.insertOne({
            name: 'any_name',
            city: 'any_city',
            country: 'any_country',
            email: 'valid_email@email.com',
            password: 'hashed_password',
            accessToken: 'old_token'
        });
        await sut.update(user.insertedId as unknown as string, 'new_valid_token');
        const updatedUser = await userModel.findOne({ _id: user.insertedId });
        expect(updatedUser?.accessToken).toEqual('new_valid_token');
    });
});