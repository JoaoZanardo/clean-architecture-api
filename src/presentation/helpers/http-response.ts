import { UnauthorizedError } from "./unauthorized-error";
import { MissingParamError } from "./missing-param";
import { ServerError } from "./server-error";

export interface HttpResponse {
    statusCode: number;
    body?: any;
}

export class HttpResponse {
    static serverError(): HttpResponse {
        return {
            statusCode: 500,
            body: new ServerError()
        }
    }

    static badRequest(error: any): HttpResponse {
        return {
            statusCode: 400,
            body: error
        }
    }

    static unauthorized(): HttpResponse {
        return {
            statusCode: 401,
            body: new UnauthorizedError()
        }
    }

    static ok(data: object): HttpResponse {
        return {
            statusCode: 200,
            body: data
        }
    }
}