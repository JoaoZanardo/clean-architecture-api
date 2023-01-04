import { agent } from "supertest";
import app from "../config/app";

describe('CORS Middleware', () => {
    it('Should enable cors', async () => {
        app.get('/test', (req, res) => {
            res.send('TEST');
        });
        const res = await agent(app).get('/test');
        expect(res.headers['access-control-allow-origin']).toEqual('*');
        expect(res.headers['access-control-allow-methods']).toEqual('*');
        expect(res.headers['access-control-allow-headers']).toEqual('*');
    });
});