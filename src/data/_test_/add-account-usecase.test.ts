import { LoadUserByEmailRepositorySpy } from "./mocks";

class AddAcountUseCaseService {
    constructor(private loadUserByEmailRepo: LoadUserByEmailRepositorySpy) { }

    async add(email: string): Promise<boolean> {
        const exists = await this.loadUserByEmailRepo.load(email);
        if (exists) return false;
        return true;
    }
}

const makeSut = () => {
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    return {
        loadUserByEmailRepositorySpy,
        sut: new AddAcountUseCaseService(loadUserByEmailRepositorySpy)
    }
}

describe('AddAccount Usecase', () => {
    it('Should returns true if account was created succesfully', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        loadUserByEmailRepositorySpy.user = null;
        const userCreated = await sut.add('valid_and_new_email');
        expect(userCreated).toBeTruthy();
    });

    it('Should returns false if email already exists', async () => {
        const { sut } = makeSut();
        const userCreated = await sut.add('valid_and-exists_email');
        expect(userCreated).toBeFalsy()
    });
});
