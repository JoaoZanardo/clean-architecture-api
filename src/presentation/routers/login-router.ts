import { HttpResponse, Validation } from "../protocols";
import { InvalidParamError, MissingParamError } from "../errors";
import { EmailValidator } from "../../validations/protocols";
import { Auth } from "../../domain/usecases";
import { Router } from "../protocols";

export class LoginRouter implements Router<LoginRouter.HttpRequest> {
    constructor(
        private authUseCase: Auth,
        private validator: Validation
    ) { }

    async route(httpRequest: LoginRouter.HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(httpRequest.body);
            if (error) return HttpResponse.badRequest(error);
            const accessToken = await this.authUseCase.auth(httpRequest.body);
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
            email: string;
            password: string;
        }
    }
}
