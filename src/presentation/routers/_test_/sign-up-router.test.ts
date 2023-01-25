import { MissingParamError } from "../../errors";

type Response = {
    statusCode: number;
    body: any
}

class SignUpRouter {
    async handle(): Promise<Response> {
        return {
            statusCode: 400,
            body: new MissingParamError('email')
        }
    }
}

describe('SignUp Router', () => {
    it('Should returns 400 if no email is provided', async () => {
        const sut = new SignUpRouter();
        const response = await sut.handle();
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });
});