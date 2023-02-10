import { Collection, Document } from 'mongodb';
import { agent } from 'supertest';
import { fakeApp } from '../src/main/config/_test_/fake-app';
import mongoHelper from '../src/infra/helpers/mongo-helper';
import bcrypt from 'bcrypt';
import env from '../src/main/config/env';

describe('Login Routes', () => {
    let userModel: Collection<Document>;

    beforeAll(async () => {
        await mongoHelper.connect(env.mongoTestUrl);
        userModel = await mongoHelper.getCollection('users');
    });

    beforeEach(async () => {
        await userModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoHelper.disconnect();
    });

    describe('/login', () => {
        it('Should return 200 when valid creditials are provided', async () => {
            await userModel.insertOne({
                email: 'valid@email.com',
                password: await bcrypt.hash('valid_password', 10)
            });

            await agent(fakeApp)
                .post('/api/login')
                .send({ email: 'valid@email.com', password: 'valid_password' })
                .expect(200);
        });

        it('Should return 400 when no credentials are provided', async () => {
            await agent(fakeApp)
                .post('/api/login')
                .send({})
                .expect(400);
        });

        it('Should return 401 when invalid credentials are provided', async () => {
            await userModel.insertOne({
                email: 'invalid_email',
                password: await bcrypt.hash('valid_password', 10)
            });

            await agent(fakeApp)
                .post('/api/login')
                .send({ email: 'valid@email.com', password: 'valid_password' })
                .expect(401);
        });
    });

    describe('/signup', () => {
        it('Should return 200 when valid creditials are provided', async () => {
            await agent(fakeApp)
                .post('/api/signup')
                .send({
                    name: 'any_name',
                    email: 'valid@email.com',
                    password: 'password',
                    passwordConfirmation: 'password'
                })
                .expect(200);
        });

        it('Should return 400 when invalid credentials are provided', async () => {
            await agent(fakeApp)
                .post('/api/signup')
                .send({})
                .expect(400);
        });

        it('Should return 403 if user already exists', async () => {
            await userModel.insertOne({
                name: 'any_name',
                email: 'any@email.com',
                password: await bcrypt.hash('valid_password', 10),
            });

            await agent(fakeApp)
                .post('/api/signup')
                .send({
                    name: 'any_name',
                    email: 'any@email.com',
                    password: 'password',
                    passwordConfirmation: 'password'
                })
                .expect(403);
        });
    });
});