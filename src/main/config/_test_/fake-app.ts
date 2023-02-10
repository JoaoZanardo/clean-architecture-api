import Express from 'express';
import { cors } from '../../../main/middlewares/cors';
import { jsonParser } from '../../../main/middlewares/json-parser';
import { setupRoutes } from '../routes';

export const fakeApp = Express();

fakeApp.disable('x-powered-by');
fakeApp.use(cors);
fakeApp.use(jsonParser);
setupRoutes(fakeApp);