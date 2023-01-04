import { HttpResponse } from "../helpers/http-response";
import { InvalidParamError, MissingParamError } from "../errors";
import { EmailValidator } from "../../interfaces/email-validator";
import { HttpRequest } from "src/interfaces/router";

export class LoginRouter {
    constructor(
        private authUseCase: any,
        private emailValidator: EmailValidator | { isValid: () => {} }
    ) { }

    async route(httpRequest: HttpRequest): Promise<HttpResponse> {
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
