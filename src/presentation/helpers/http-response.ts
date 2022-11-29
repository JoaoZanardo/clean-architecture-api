import { UnauthorizedError } from "./unauthorized-error";
import { MissingParamError } from "./missing-param";

export interface HttpResponse {
    statusCode: number;
    body?: any;
}

export class HttpResponse {
    static badRequest(param: string): HttpResponse {
        return {
            statusCode: 400,
            body: new MissingParamError(param)
        };
    }

    static unauthorized(): HttpResponse {
        return {
            statusCode: 401,
            body: new UnauthorizedError()
        }
    }

    static ok(): HttpResponse {
        return {
            statusCode: 200,
        }
    }
}