import { Collection, Document, MongoClient } from 'mongodb';
import { DbLoadUserByEmailRepository } from './load-user-by-email-repository';

const makeSut = (userModel: Collection<Document>) => {
    return new DbLoadUserByEmailRepository(userModel);
};

describe('LoadUserByEmail Repository', () => {
    let userModel: Collection<Document>;
    let connection: MongoClient;

    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URL as string, {});
        const db = connection.db();
        userModel = db.collection('users');
    });

    beforeEach(async () => {
        await userModel.deleteMany({});
    });

    afterAll(async () => {
        await connection.close();
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