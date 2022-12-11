export class TokenGenerator {
    async generate(id: string): Promise<string | null> {
        return null;
    }
}

describe('Token Generator', () => {
    it('Should returns null if JWT returns null', async () => {
        const sut = new TokenGenerator();
        const accessToken = await sut.generate('any_user_id');
        expect(accessToken).toBeNull();
    });
});