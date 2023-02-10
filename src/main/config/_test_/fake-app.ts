import Express from 'express';
import { setupRoutes } from '../routes';
import { setupApp } from '../setup';

export const fakeApp = Express();
setupApp(fakeApp);
setupRoutes(fakeApp);