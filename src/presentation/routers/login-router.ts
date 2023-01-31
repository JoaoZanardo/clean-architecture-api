import { HttpResponse } from "../protocols";
import { InvalidParamError, MissingParamError } from "../errors";
import { EmailValidator } from "../../validations/protocols";
import { Auth } from "../../domain/usecases";
import { Router } from "../protocols";

export class LoginRouter implements Router<LoginRouter.HttpRequest> {
    constructor(
        private authUseCase: Auth,
        private emailValidator: EmailValidator
    ) { }

    async route(httpRequest: LoginRouter.HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body;
            if (!email) return HttpResponse.badRequest(new MissingParamError('email'));
            if (!this.emailValidator.isValid(email)) return HttpResponse.badRequest(new InvalidParamError('email'));
            if (!password) return HttpResponse.badRequest(new MissingParamError('password'));
            const accessToken = await this.authUseCase.auth({email, password});
            if (!accessToken) return HttpResponse.unauthorized();
            return HttpResponse.ok({ accessToken });
        } catch (error) {
            console
            return HttpResponse.serverError();
        }
    }
}

export namespace LoginRouter {
    export type HttpRequest = {
        body: {
            email?: string;
            password?: string;
        }
    }
}
