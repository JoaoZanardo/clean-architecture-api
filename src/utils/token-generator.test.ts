import { TokenGeneratorImplementation } from "./token-generator-implementation";

jest.mock("./token-generator-implementation")

const makeSut = () => {
    return new TokenGeneratorImplementation('secret') as jest.Mocked<TokenGeneratorImplementation>;
};

describe('Token Generator', () => {
    it('Should returns null if JWT returns null', () => {
        const sut = makeSut();
        sut.generate.mockReturnValueOnce(null);
        const token = sut.generate('any_id');
        expect(token).toBeNull();
    });

    it('Should returns a token returns token', () => {
        const sut = makeSut();
        sut.generate.mockReturnValueOnce('valid_token');
        const token = sut.generate('any_id');
        expect(token).toEqual('valid_token');
    });
});