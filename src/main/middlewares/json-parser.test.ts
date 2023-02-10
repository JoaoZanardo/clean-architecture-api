import { agent } from "supertest";
import { fakeApp } from "../config/fake-app";

describe('JSON Parser Middleware', () => {
    it('Should parse body as JSON', async () => {
        fakeApp.post('/test', (req, res) => {
            res.send(req.body);
        });

        await agent(fakeApp)
            .post('/test')
            .send({ name: 'Zanardo' })
            .expect({ name: 'Zanardo' })
    });
});