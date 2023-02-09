import { Auth } from "../../domain/usecases";
import { AddAccount } from "../../domain/usecases/add-account";
import { HttpResponse, Router, Validation } from "../protocols";

export class SignUpRouter implements Router<SignUpRouter.HttpRequest> {
    constructor(
        private validator: Validation,
        private addAccountUseCase: AddAccount,
        private authUseCase: Auth
    ) { }

    async route(HttpRequest: SignUpRouter.HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(HttpRequest.body);
            if (error) return HttpResponse.badRequest(error);
            const { email, name, password } = HttpRequest.body
            const isValid = await this.addAccountUseCase.add({ name, email, password });
            if (!isValid) return HttpResponse.forbiden();
            const accessToken = await this.authUseCase.auth({ email, password });
            if (!accessToken) return HttpResponse.unauthorized();
            return HttpResponse.ok({ accessToken });
        } catch (error) {
            return HttpResponse.serverError();
        }
    }
}

export namespace SignUpRouter {
    export type HttpRequest = {
        body: {
            name: string;
            email: string;
            password: string;
            passwordConfirmation: string;
        }
    }
}