import { MissingParamError } from "./missing-param";

export class HttpResponse {
    static badRequest(param: string) {
        return {
            statusCode: 400,
            body: new MissingParamError(param)
        };
    }
}