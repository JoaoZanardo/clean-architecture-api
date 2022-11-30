import { HttpResponse } from "../helpers/http-response";
import { MissingParamError } from "../helpers/missing-param";

interface Body {
    email?: string;
    password?: string;
}

export class LoginRouter {
    constructor(private authUseCase: any) { }

    async route(httpRequest: { body: Body }): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body;
            if (!email) return HttpResponse.badRequest(new MissingParamError('email'));
            if (!password) return HttpResponse.badRequest(new MissingParamError('password'));
            const accessToken = await this.authUseCase.auth(email, password);
            if (!accessToken) return HttpResponse.unauthorized();
            return HttpResponse.ok({ accessToken });
        } catch (error) {
            return HttpResponse.serverError();
        }
    }
}
