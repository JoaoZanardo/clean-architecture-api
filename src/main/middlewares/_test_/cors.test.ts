import { agent } from "supertest";
import { fakeApp } from "../../config/_test_/fake-app";

describe('CORS Middleware', () => {
    it('Should enable cors', async () => {
        fakeApp.get('/test', (req, res) => {
            res.send('TEST');
        });
        const res = await agent(fakeApp).get('/test');
        expect(res.headers['access-control-allow-origin']).toEqual('*');
        expect(res.headers['access-control-allow-methods']).toEqual('*');
        expect(res.headers['access-control-allow-headers']).toEqual('*');
    });
});