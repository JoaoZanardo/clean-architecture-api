import { MissingParamError } from "../helpers/missing-param";
import { LoginRouter } from "./login-router";

const makeSut = (): LoginRouter => {
    return new LoginRouter();
};

describe('Login Router', () => {
    it('Should return 400 if no email is provided', async () => {
        const sut = makeSut();
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
        const sut = makeSut();
        const htppRequest = {
            body: {
                email: 'any_email'
            }
        };
        const htppResponse = sut.route(htppRequest);
        expect(htppResponse.statusCode).toBe(400);
        expect(htppResponse.body).toEqual(new MissingParamError('password'));
    });
});