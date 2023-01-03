import { agent } from 'supertest';
import app from './app';

describe('App Setup', () => {
    test('Should disable x-powered-by header', async () => {
        app.get('/test', (req, res) => {
            res.send('TEST');
        });
        const res = await agent(app).get('/test');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    test('Should enable cors', async () => {
        app.get('/test', (req, res) => {
            res.send('TEST');
        });
        const res = await agent(app).get('/test');
        console.log(res.headers);
        expect(res.headers['access-control-allow-origin']).toEqual('*');
        expect(res.headers['access-control-allow-methods']).toEqual('*');
        expect(res.headers['access-control-allow-headers']).toEqual('*');
    });
});