import { agent } from 'supertest';
import { fakeApp } from './fake-app';
describe('App Setup', () => {
    it('Should disable x-powered-by header', async () => {
        fakeApp.get('/test', (req, res) => {
            res.send('TEST');
        });
        const res = await agent(fakeApp).get('/test');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});