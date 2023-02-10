import { Application } from "express";
import { setupRoutes } from "./routes";
import { setupApp } from "./setup";
import mongoHelper from "../../infra/helpers/mongo-helper";
import env from "./env";

export class Server {
    constructor(
        private app: Application,
        private port: number = 3000
        ) { }

    async init(): Promise<void> {
        this.setupApp();
        this.setupRoutes();
        await this.databaseSetup();
        this.start();
    }

    private setupRoutes(): void {
        setupRoutes(this.app);
    }

    private setupApp(): void {
        setupApp(this.app);
    }

    private async databaseSetup(): Promise<void> {
        await mongoHelper.connect(env.mongoUrl);
    }

    private async close(): Promise<void> {
        await mongoHelper.disconnect();
    }

    start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running at port: ${this.port}`);
        });
    }
}