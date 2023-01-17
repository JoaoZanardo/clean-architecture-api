import { Jwt } from "../jwt";
import jwt from 'jsonwebtoken';

interface MockedJwt {
    payload: string;
    token: string | null;
}

jest.mock('jsonwebtoken', () => ({
    payload: '',
    token: null,

    sign(payload: string): string | null {
        this.payload = payload;
        return this.token;
    },
}));

const makeSut = () => {
    return {
        sut: new Jwt('secret'),
        mockedJwt: jwt as unknown as jest.Mocked<MockedJwt>
    };
};

describe('Token Generator', () => {
    it('Should returns null if JWT returns null', () => {
        const { sut } = makeSut();
        const token = sut.generate('any_id');
        expect(token).toBeNull();
    });

    it('Should returns a token if JWT returns a token', () => {
        const { sut, mockedJwt } = makeSut();
        mockedJwt.token = 'valid_token';
        const token = sut.generate('any_id');
        expect(token).toEqual('valid_token');
    });

    it('Should call jwt with correct value', () => {
        const { sut, mockedJwt } = makeSut();
        sut.generate('any_id');
        expect(mockedJwt.payload).toEqual('any_id');
    });
})