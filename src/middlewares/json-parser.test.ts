import { agent } from "supertest";
import app from "../main/config/app";

describe('JSON Parser Middleware', () => {
    it('Should parse body as JSON', async () => {
        app.post('/test', (req, res) => {
            res.send(req.body);
        });

        await agent(app)
            .post('/test')
            .send({ name: 'Zanardo' })
            .expect({ name: 'Zanardo' })
    });
});