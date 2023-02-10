import Express, { Router } from 'express';
import { loginRoutes } from '../../../main/routes/login-routes';
import { cors } from '../../../main/middlewares/cors';
import { jsonParser } from '../../../main/middlewares/json-parser';

export const fakeApp = Express();

fakeApp.disable('x-powered-by');
fakeApp.use(cors);
fakeApp.use(jsonParser);

const router = Router();
fakeApp.use('/api', router);
loginRoutes(router);
