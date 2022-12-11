import { EncrypterImplementation } from "./encrypter-implementation";

jest.mock("./encrypter");

const makeMockedSut = () => {
    return new EncrypterImplementation() as jest.Mocked<EncrypterImplementation>;
};

describe('Encrypter', () => {
    it('Should returns true if encrypter returns true', async () => {
        const mockedSut = makeMockedSut();
        mockedSut.compare.mockResolvedValueOnce(true);
        const isValid = await mockedSut.compare('any_value', 'hashed_value');
        expect(isValid).toBeTruthy();
    });

    it('Should returns false if encrypter returns false', async () => {
        const mockedSut = makeMockedSut();
        mockedSut.compare.mockResolvedValueOnce(false);
        const isValid = await mockedSut.compare('any_value', 'hashed_value');
        expect(isValid).toBeFalsy();
    });
});