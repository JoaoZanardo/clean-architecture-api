import { Auth } from "src/domain/usecases";
import { AddAccount } from "src/domain/usecases/add-account";
import { EmailValidator } from "../../validations/protocols";
import { InvalidParamError, MissingParamError } from "../errors";
import { HttpResponse, Router } from "../protocols";

export class SignUpRouter implements Router<SignUpRouter.HttpRequest> {
    constructor(
        private emailValidator: EmailValidator,
        private addAccountUseCase: AddAccount,
        private authUseCase: Auth
    ) { }

    async route(request: SignUpRouter.HttpRequest): Promise<HttpResponse> {
        const { email, name, password, passwordConfirmation } = request.body
        if (!name) return HttpResponse.badRequest(new MissingParamError('name'));
        if (!email) return HttpResponse.badRequest(new MissingParamError('email'));
        if (!this.emailValidator.isValid(email)) return HttpResponse.badRequest(new InvalidParamError('email'));
        if (!password) return HttpResponse.badRequest(new MissingParamError('password'));
        if (!passwordConfirmation) return HttpResponse.badRequest(new MissingParamError('passwordConfirmation'));
        if (password !== passwordConfirmation) return HttpResponse.badRequest(new InvalidParamError('password'));
        const isValid = await this.addAccountUseCase.add({ name, email, password });
        if (!isValid) return HttpResponse.forbiden();
        const accessToken = await this.authUseCase.auth({email, password});
        if (!accessToken) return HttpResponse.unauthorized();
        return HttpResponse.ok({ accessToken });
    }
}

export namespace SignUpRouter {
    export type HttpRequest = {
        body: {
            name?: string;
            email?: string;
            password?: string;
            passwordConfirmation?: string;
        }
    }
}