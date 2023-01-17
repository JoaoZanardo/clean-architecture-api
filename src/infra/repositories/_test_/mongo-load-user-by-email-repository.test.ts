import { Collection, Document } from 'mongodb';
import env from '../../../main/config/env';
import mongoHelper from '../../helpers/mongo-helper';
import { MongoDBLoadUserByEmailRepository } from '../';

const makeSut = () => {
    return new MongoDBLoadUserByEmailRepository();
};

describe('LoadUserByEmail Repository', () => {
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

    it('Should returns null if no user is found', async () => {
        const sut = makeSut();
        const user = await sut.load('invalid_email@email.com');
        expect(user).toBeNull();
    });

    it('Should returns an user if user is found', async () => {
        const sut = makeSut();
        const fakeUser = await userModel.insertOne({
            name: 'any_name',
            city: 'any_city',
            country: 'any_country',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        });
        const user = await sut.load('valid_email@email.com');
        expect(user?.id).toEqual(fakeUser.insertedId.toString());
    });
});