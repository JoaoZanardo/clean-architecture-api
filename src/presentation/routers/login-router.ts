import { HttpResponse } from "../helpers/http-response";

interface Body {
    email?: string;
    password?: string;
}

export class LoginRouter {
    constructor(private authUseCase: any) { }

    async route(httpRequest: { body: Body }): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body;
            if (!email) return HttpResponse.badRequest('email');
            if (!password) return HttpResponse.badRequest('password');
            const accessToken = await this.authUseCase.auth(email, password);
            if (!accessToken) return HttpResponse.unauthorized();
            return HttpResponse.ok({ accessToken });
        } catch (error) {
            return HttpResponse.serverError();
        }
    }
}
