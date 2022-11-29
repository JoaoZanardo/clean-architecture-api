interface Body {
    email?: string;
    password?: string;
}

class LoginRouter {
    route(httpRequest: { body: Body }): { statusCode: number } {
        if (!httpRequest.body.email) return { statusCode: 400 };
        return { statusCode: 200 };
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
    });
});