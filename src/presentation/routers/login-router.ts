import { HttpResponse } from "../helpers/http-response";
import { InvalidParamError, MissingParamError } from "../errors";


interface Body {
    email?: string;
    password?: string;
}

export interface EmailValidator {
    isValid(email: string): boolean | Error;
}

export class LoginRouter {
    constructor(
        private authUseCase: any,
        private emailValidator: EmailValidator
    ) { }

    async route(httpRequest: { body: Body }): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body;
            if (!email) return HttpResponse.badRequest(new MissingParamError('email'));
            if (!this.emailValidator.isValid(email)) return HttpResponse.badRequest(new InvalidParamError('email'));
            if (!password) return HttpResponse.badRequest(new MissingParamError('password'));
            const accessToken = await this.authUseCase.auth(email, password);
            if (!accessToken) return HttpResponse.unauthorized();
            return HttpResponse.ok({ accessToken });
        } catch (error) {
            return HttpResponse.serverError();
        }
    }
}
