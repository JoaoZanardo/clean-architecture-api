import {
    MissingParamError,
    UnauthorizedError,
    ServerError,
    InvalidParamError
} from "../errors";
import { EmailValidator, LoginRouter } from "./login-router";

const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase();
    const authUseCaseWithError = makeAuthUseCaseWithError();
    const emailValidatorSpy = makeEmailValidator();
    const emailValidatorWithError = makeEmailValidatorWithError();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    return {
        sut,
        authUseCaseSpy,
        emailValidatorSpy,
        authUseCaseWithError,
        emailValidatorWithError
    }
};

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        public email: string = '';
        public password: string = '';
        public accessToken: string | null = 'VALID-ACCESS-TOKEN';

        async auth(email: string, password: string): Promise<string | null> {
            this.email = email;
            this.password = password;

            return this.accessToken;
        }
    }

    return new AuthUseCaseSpy();
};
const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        async auth(): Promise<Error> {
            throw new Error('something went wrong');
        }
    }

    return new AuthUseCaseSpy();
};

const makeEmailValidator = () => {
    class EmailValidatorSpy implements EmailValidator {
        public isEmailValid: boolean = true;
        public email: string | null = null;

        isValid(email: string): boolean {
            this.email = email;
            return this.isEmailValid;
        }
    }

    return new EmailValidatorSpy();
};

const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        isValid(): Error {
            throw new Error();
        }
    }

    return new EmailValidatorSpy();
};

describe('Login Router', () => {
    it('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const htppRequest = {
            body: {
                password: 'any_password'
            }
        };
        const htppResponse = await sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('email'));
    });

    it('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorSpy } = makeSut();
        emailValidatorSpy.isEmailValid = false;

        const htppRequest = {
            body: {
                email: 'invalid_email',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });

    it('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const htppRequest = {
            body: {
                email: 'any_email'
            }
        };
        const htppResponse = await sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('password'));
    });

    it('Should return 401 when invalid credentials are provided', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accessToken = null;
        const htppRequest = {
            body: {
                email: 'invalid_email',
                password: 'invalid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    it('Should return 200 when valid credentials are provided', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const htppRequest = {
            body: {
                email: 'valid_email',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
    });

    it('Should return 500 if AuthUseCase throws', async () => {
        const { authUseCaseWithError, emailValidatorSpy } = makeSut();

        const sut = new LoginRouter(authUseCaseWithError, emailValidatorSpy);
        const htppRequest = {
            body: {
                email: 'valid_email',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    it('Should return 500 if EmailValidator throws', async () => {
        const { authUseCaseSpy, emailValidatorWithError } = makeSut();

        const sut = new LoginRouter(authUseCaseSpy, emailValidatorWithError);
        const htppRequest = {
            body: {
                email: 'valid_email',
                password: 'valid_password'
            }
        };
        const httpResponse = await sut.route(htppRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    it('Should call AuthUseCase with correct params', async () => {
        const { sut, authUseCaseSpy } = makeSut();
        const htppRequest = {
            body: {
                email: 'any_email',
                password: 'any_password'
            }
        };
        await sut.route(htppRequest);
        expect(authUseCaseSpy.email).toEqual(htppRequest.body.email);
        expect(authUseCaseSpy.password).toEqual(htppRequest.body.password);
    });

    it('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorSpy } = makeSut();
        const htppRequest = {
            body: {
                email: 'any_email',
                password: 'any_password'
            }
        };
        await sut.route(htppRequest);
        expect(emailValidatorSpy.email).toEqual(htppRequest.body.email);
    });
});