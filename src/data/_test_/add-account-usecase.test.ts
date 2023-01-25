import { AddAcountUseCaseService } from "../usecases";
import { AddAccountRepositorySpy, EncrypterSpy, LoadUserByEmailRepositorySpy } from "./mocks";

const makeSut = () => {
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    loadUserByEmailRepositorySpy.user = null;
    const addAccountRepository = new AddAccountRepositorySpy();
    const encrypter = new EncrypterSpy();
    const sut = new AddAcountUseCaseService(
        loadUserByEmailRepositorySpy,
        addAccountRepository,
        encrypter
    );
    return {
        loadUserByEmailRepositorySpy,
        addAccountRepository,
        encrypter,
        sut
    }
}

describe('AddAccount Usecase', () => {
    const params = {
        name: 'any_name',
        email: 'valid_email',
        password: 'any_password'
    }

    it('Should returns true if account was created succesfully', async () => {
        const { sut } = makeSut();
        const isValid = await sut.add(params);
        expect(isValid).toBeTruthy();
    });

    it('Should returns false if email already exists', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        loadUserByEmailRepositorySpy.user = { id: 'any_id', password: 'any_password' };
        const isValid = await sut.add(params);
        expect(isValid).toBeFalsy()
    });

    it('Should calls AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepository } = makeSut();
        const values = jest.spyOn(addAccountRepository, 'add')
        await sut.add(params);
        expect(values).toHaveBeenCalledWith({ ...params, password: 'hashed_value' });
    });

    it('Should calls Encrypter with correct password', async () => {
        const { sut, encrypter } = makeSut();
        const password = jest.spyOn(encrypter, 'hash');
        await sut.add(params);
        expect(password).toHaveBeenCalledWith('any_password');
    });

    it('Should calls LoadUserByEmailRepository with correct email', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        const email = jest.spyOn(loadUserByEmailRepositorySpy, 'load');
        await sut.add(params);
        expect(email).toHaveBeenCalledWith('valid_email');
    });
});
