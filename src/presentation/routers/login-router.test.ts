interface Body {
    email?: string;
    password?: string;
}

class LoginRouter {
    route(httpRequest: { body: Body }): { statusCode: number, body: MissingParamError } {
        const { email, password } = httpRequest.body;
        if (!email) return HttpResponse.badRequest('email');
        if (!password) return HttpResponse.badRequest('password');
        return { statusCode: 200, body: new MissingParamError('nothing') };
    }
}

class HttpResponse {
    static badRequest(param: string) {
        return {
            statusCode: 400,
            body: new MissingParamError(param)
        };
    }
}

class MissingParamError extends Error {
    constructor(paramName: string) {
        super(`Missing param: ${paramName}`);
        this.name = paramName;
    }
}

describe('Login Router', () => {
    it('Should return 400 if no email is provided', async () => {
        const sut = new LoginRouter();
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
        const sut = new LoginRouter();
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