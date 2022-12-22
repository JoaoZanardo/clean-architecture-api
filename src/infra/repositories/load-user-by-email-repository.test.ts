import { Collection, Document, MongoClient, WithId } from 'mongodb';

interface User {
    name: string;
    email: string;
    password: string;
    city: string;
    country: string;
}

class LoadUserByEmailRepository {
    constructor(private userModel: Collection<Document>) { }

    async load(email: string): Promise<WithId<Document> | null> {
        const user = await this.userModel.findOne({ email }, {
            projection: {
                password: 1
            }
        });
        return user;
    }
}

const makeSut = (userModel: Collection<Document>) => {
    return new LoadUserByEmailRepository(userModel);
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