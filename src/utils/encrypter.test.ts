class EncrypterImplementation {
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return true;
    }
}

describe('Encrypter', () => {
    it('Should returns true if encrypter returns true', async () => {
        const sut = new EncrypterImplementation();
        const isValid = await sut.compare('any_password', 'hashed_password');
        expect(isValid).toBeTruthy();
    });
});