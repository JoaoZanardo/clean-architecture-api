import { AddAccountRepositorySpy, EncrypterSpy, LoadUserByEmailRepositorySpy } from "./mocks";

type Params = {
    name: string;
    email: string;
    password: string;
}

class AddAcountUseCaseService {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepositorySpy,
        private addAccountRepository: AddAccountRepositorySpy,
        private Encrypter: EncrypterSpy
    ) { }

    async add(params: Params): Promise<boolean> {
        const exists = await this.loadUserByEmailRepo.load(params.email);
        let isValid = false
        if (!exists) {
            const hashedPassword = await this.Encrypter.hash(params.password);
            isValid = await this.addAccountRepository.add({ ...params, password: hashedPassword });
        }
        return isValid;
    }
}

const makeSut = () => {
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    loadUserByEmailRepositorySpy.user = null;
    const addAccountRepository = new AddAccountRepositorySpy();
    const encrypter = new EncrypterSpy();
    return {
        loadUserByEmailRepositorySpy,
        addAccountRepository,
        encrypter,
        sut: new AddAcountUseCaseService(
            loadUserByEmailRepositorySpy,
            addAccountRepository,
            encrypter
        )
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

    it('Should calls Encrypter with correct value', async () => {
        const { sut, encrypter } = makeSut();
        const value = jest.spyOn(encrypter, 'hash');
        await sut.add(params);
        expect(value).toHaveBeenCalledWith('any_password');
    });
});
