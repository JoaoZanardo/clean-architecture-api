import Express from 'express';
import env from './config/env';
import { Server } from "./config/server";

enum ExitStatus {
    Success = 0,
    Failure = 1
}

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.log(`App exiting due to an unhandled promise: ${promise} and reason: ${reason}`);
    throw reason;
});

process.on('uncaughtException', (error) => {
    console.log(`App exiting due to an uncaught exception ${error}`);
    process.exit(ExitStatus.Failure);
});

(async () => {
    try {
        const app = Express()
        const server = new Server(app, env.port);
        await server.init();
        server.start();

        const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        exitSignals.map(sig => process.on(sig, async () => {
            try {
                await server.close();
                console.log('App exited with success');
                process.exit(ExitStatus.Success);
            } catch (error) {
                console.error(`App exited with error: ${error}`);
                process.exit(ExitStatus.Failure);
            }
        }));
    } catch (error) {
        console.error(`App exited with error: ${error}`);
        process.exit(ExitStatus.Failure);
    }
})();