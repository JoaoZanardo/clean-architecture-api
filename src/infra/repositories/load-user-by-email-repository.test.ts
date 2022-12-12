import { Collection, Document, MongoClient, WithId } from 'mongodb';

interface User {
    email: string
}

class LoadUserByEmailRepository {
    constructor(private userModel: Collection<Document>) { }

    async load(email: string): Promise<WithId<Document> | null> {
        const user = await this.userModel.findOne({ email });
        return user;
    }
}

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
        const sut = new LoadUserByEmailRepository(userModel);
        const user = await sut.load('invalid_email@email.com');
        expect(user).toBeNull();
    });

    it('Should returns an user if user is found', async () => {
        const sut = new LoadUserByEmailRepository(userModel);
        await userModel.insertOne({
            email: 'valid_email@email.com'
        });
        const user = await sut.load('valid_email@email.com');
        expect(user?.email).toEqual('valid_email@email.com');
    });
});