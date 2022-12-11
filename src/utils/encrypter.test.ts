import { EncrypterImplementation } from "./encrypter-implementation";

jest.mock("./encrypter-implementation");

const makeSut = () => {
    return new EncrypterImplementation() as jest.Mocked<EncrypterImplementation>;
};

describe('Encrypter', () => {
    it('Should returns true if encrypter returns true', async () => {
        const sut = makeSut();
        sut.compare.mockResolvedValueOnce(true);
        const isValid = await sut.compare('any_value', 'hashed_value');
        expect(isValid).toBeTruthy();
    });

    it('Should returns false if encrypter returns false', async () => {
        const sut = makeSut();
        sut.compare.mockResolvedValueOnce(false);
        const isValid = await sut.compare('any_value', 'hashed_value');
        expect(isValid).toBeFalsy();
    });
});