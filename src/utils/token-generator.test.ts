import { Jwt } from "./jwt";

jest.mock("./jwt")

const makeSut = () => {
    return new Jwt('secret') as jest.Mocked<Jwt>;
};

describe('Token Generator', () => {
    it('Should returns null if JWT returns null', () => {
        const sut = makeSut();
        sut.generate.mockReturnValueOnce(null);
        const token = sut.generate('any_id');
        expect(token).toBeNull();
    });

    it('Should returns a token if JWT returns a token', () => {
        const sut = makeSut();
        sut.generate.mockReturnValueOnce('valid_token');
        const token = sut.generate('any_id');
        expect(token).toEqual('valid_token');
    });
});