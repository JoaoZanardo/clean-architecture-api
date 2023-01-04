import { Collection, Document, MongoClient } from 'mongodb';
import mongoHelper from '../helpers/mongo-helper';
import { DbLoadUserByEmailRepository } from './load-user-by-email-repository';

const makeSut = (userModel: Collection<Document>) => {
    return new DbLoadUserByEmailRepository(userModel);
};

describe('LoadUserByEmail Repository', () => {
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

    it('Should returns null if no user is found', async () => {
        const sut = makeSut(userModel);
        const user = await sut.load('invalid_email@email.com');
        expect(user).toBeNull();
    });

    it('Should returns an user if user is found', async () => {
        const sut = makeSut(userModel);
        const fakeUser = await userModel.insertOne({
            name: 'any_name',
            city: 'any_city',
            country: 'any_country',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        });
        const user = await sut.load('valid_email@email.com');
        expect(user?._id).toEqual(fakeUser.insertedId);
    });
});