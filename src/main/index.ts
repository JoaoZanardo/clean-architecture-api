import Express from 'express';
import { Server } from "./config/server";

(async () => {
    try {
        const app = Express()
        const server = new Server(app);
        await server.init();
        server.start();
    } catch (error) {
        console.error(`App exited with error: ${error}`);
    }
})();