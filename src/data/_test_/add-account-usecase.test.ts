class AddAcountUseCaseService {
    async add(): Promise<boolean> {
        return true;
    }
}

describe('AddAccount Usecase', () => {
    it('Should return true if account was created succesfully', async () => {
        const sut = new AddAcountUseCaseService();
        const userCreated = await sut.add();
        expect(userCreated).toBeTruthy();
    });
});
