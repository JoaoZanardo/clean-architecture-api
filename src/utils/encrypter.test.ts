import bcrypt from 'bcrypt';
import { Bcrypt } from './bcrypt';

interface MockedBcrypt {
    isValid: boolean;
    value: string;
    hash: string;
}

jest.mock('bcrypt', () => ({
    value: '',
    hash: '',
    isValid: true,

    async compare(value: string, hash: string) {
        this.value = value
        this.hash = hash
        return this.isValid
    },
}));

const makeSut = () => {
    const mockedBcrypt = bcrypt as unknown as jest.Mocked<MockedBcrypt>;
    return {
        sut: new Bcrypt(),
        mockedBcrypt
    }
};

describe('Encrypter', () => {
    it('Should returns true if encrypter returns true', async () => {
        const { sut } = makeSut();
        const isValid = await sut.compare('any_value', 'hashed_value');
        expect(isValid).toBeTruthy();
    });

    it('Should returns false if encrypter returns false', async () => {
        const { sut, mockedBcrypt } = makeSut();
        mockedBcrypt.isValid = false;
        const isValid = await sut.compare('any_value', 'hashed_value');
        expect(isValid).toBeFalsy();
    });

    it('Should call bcrypt with correct values', async () => {
        const { sut, mockedBcrypt } = makeSut();
        await sut.compare('any_value', 'hashed_value');
        expect(mockedBcrypt.value).toEqual('any_value');
        expect(mockedBcrypt.hash).toEqual('hashed_value');
    });
});