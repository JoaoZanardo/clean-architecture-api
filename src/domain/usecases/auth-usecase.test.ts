import { AuthUseCase, LoadUserByEmailRepositorySpy } from "./auth-usecase";

const makeSut = () => {
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    return {
        loadUserByEmailRepositorySpy,
        sut: new AuthUseCase(loadUserByEmailRepositorySpy)
    }
};

describe('Auth Usecase', () => {
    it('Should returns null if LoadUserByEmailRepository returns null', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.auth('valid@email.com', 'password');
        expect(accessToken).toBeNull();
    });
});