import { Collection, Document } from "mongodb";
import mongoHelper from "../helpers/mongo-helper";

class UpdateAccessTokenRepository {
    constructor(private userModel: Collection<Document>) { }

    async update(userId: string, accessToken: string): Promise<void> {
        await this.userModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    accessToken
                }
            });
    }
}

describe('UpdateAccessToken Repository', () => {
    let userModel: Collection<Document>;

    beforeAll(async () => {
        const { db } = await mongoHelper.connect(process.env.MONGO_URL as string, 'test');
        userModel = db.collection('users');
    });

    beforeEach(async () => {
        await userModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoHelper.disconnect();
    });

    test('Should update the user with the given token', async () => {
        const sut = new UpdateAccessTokenRepository(userModel);
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