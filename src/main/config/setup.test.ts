import { agent } from 'supertest';
import app from './app';

describe('App Setup', () => {
    it('Should disable x-powered-by header', async () => {
        app.get('/test', (req, res) => {
            res.send('TEST');
        });
        const res = await agent(app).get('/test');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});