import { HttpResponse } from "../helpers/http-response";
import { MissingParamError } from "../helpers/missing-param";

interface Body {
    email?: string;
    password?: string;
}

export class LoginRouter {
    constructor(private authUseCase: any) { }

    route(httpRequest: { body: Body }): { statusCode: number, body: MissingParamError } {
        const { email, password } = httpRequest.body;
        if (!email) return HttpResponse.badRequest('email');
        if (!password) return HttpResponse.badRequest('password');
        this.authUseCase.auth(email, password);
        return { statusCode: 200, body: new MissingParamError('nothing') };
    }
}
