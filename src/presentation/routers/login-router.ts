import { HttpResponse } from "../helpers/http-response";
import { InvalidParamError, MissingParamError } from "../errors";
import { EmailValidator } from "../../validations/protocols";
import { HttpRequest } from "../../interfaces/router";
import { AuthUseCase } from "../../domain/usecases";

export class LoginRouter {
    constructor(
        private authUseCase: AuthUseCase,
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
            console
            return HttpResponse.serverError();
        }
    }
}
