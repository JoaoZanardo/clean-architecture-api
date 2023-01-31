import { Auth } from "../../../../domain/usecases";

export class AuthUseCaseSpy {
    public token: Auth.Result = 'valid_token';

    async auth(params: Auth.Params): Promise<Auth.Result> {
        return this.token;
    }
}