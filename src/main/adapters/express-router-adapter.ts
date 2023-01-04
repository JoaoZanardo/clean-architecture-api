import { Request, Response } from "express";
import { Router } from "../../interfaces/router";

type ExpressFunction = (req: Request, res: Response) => Promise<void>;

export class ExpressRouterAdapter {
    static adapt(router: Router): ExpressFunction {
        return async (req: Request, res: Response) => {
            const httpRequest = {
                body: req.body
            };
            const httpResponse = await router.route(httpRequest);
            res.status(httpResponse.statusCode).json(httpResponse.body);
        }
    }
}