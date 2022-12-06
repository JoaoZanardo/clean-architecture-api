import { EncrypterImplementation } from "./encrypter";

jest.mock("./encrypter");

describe('Encrypter', () => {
    const mockedEncrypterImplementation = new EncrypterImplementation() as jest.Mocked<EncrypterImplementation>;

    it('Should returns true if encrypter returns true', async () => {
        mockedEncrypterImplementation.compare.mockResolvedValueOnce(true);
        const isValid = await mockedEncrypterImplementation.compare('any_value', 'hashed_value');
        expect(isValid).toBeTruthy();
    });

    it('Should returns false if encrypter returns false', async () => {
        mockedEncrypterImplementation.compare.mockResolvedValueOnce(false);
        const isValid = await mockedEncrypterImplementation.compare('any_value', 'hashed_value');
        expect(isValid).toBeFalsy();
    });
});