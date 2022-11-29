import { MissingParamError } from "../helpers/missing-param";
import { LoginRouter } from "./login-router";

const makeSut = () => {
    class AuthUseCaseSpy {
        public email: string = '';
        public password: string = '';

        auth(email: string, password: string) {
            this.email = email;
            this.password = password;
        }
    }

    const authUseCaseSpy = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCaseSpy);
    return {
        sut,
        authUseCaseSpy
    }
};

describe('Login Router', () => {
    it('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const htppRequest = {
            body: {
                password: 'any_password'
            }
        };
        const htppResponse = sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('email'));
    });

    it('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const htppRequest = {
            body: {
                email: 'any_email'
            }
        };
        const htppResponse = sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('password'));
    });

    it('Should call AuthUseCase with correct params', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const htppRequest = {
            body: {
                email: 'any_email',
                password: 'any_password'
            }
        };
        sut.route(htppRequest);
        expect(authUseCaseSpy.email).toEqual(htppRequest.body.email);
        expect(authUseCaseSpy.password).toEqual(htppRequest.body.password);
    });
});