import { Application } from "express";
import { setupRoutes } from "./routes";
import mongoHelper from "../../infra/helpers/mongo-helper";
import env from "./env";
import { cors } from "../middlewares/cors";
import { jsonParser } from "../middlewares/json-parser";

export class Server {
    constructor(
        private _app: Application,
        private port: number = 3000
        ) { }

    async init(): Promise<void> {
        this.setupApp();
        this.setupRoutes();
        await this.databaseSetup();
    }

    private setupRoutes(): void {
        setupRoutes(this._app);
    }

    private setupApp(): void {
        this._app.disable('x-powered-by');
        this._app.use(cors);
        this._app.use(jsonParser);
    }

    private async databaseSetup(): Promise<void> {
        await mongoHelper.connect(env.mongoUrl);
    }

    private async close(): Promise<void> {
        await mongoHelper.disconnect();
    }

    get app(): Application {
        return this._app;
    }

    start(): void {
        this._app.listen(this.port, () => {
            console.log(`Server running at port: ${this.port}`);
        });
    }
}