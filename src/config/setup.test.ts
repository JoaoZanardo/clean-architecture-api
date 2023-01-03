import { agent } from 'supertest';
import app from './app';

describe('App Setup', () => {
    test('Should disable x-powered-by header', async () => {
        app.get('/test', (req, res) => {
            res.send('TEST');
        });
        const res = await agent(app).get('/test');
        console.log(res.headers)
        expect(res.headers['x-powered-by']).toBeUndefined();
    });
});