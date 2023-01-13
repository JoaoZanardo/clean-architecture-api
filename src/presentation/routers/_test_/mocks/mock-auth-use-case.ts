export class AuthUseCaseSpy {
    public token: string | null = 'valid_token';

    async auth(email: string, password: string): Promise<string | null> {
        return this.token;
    }
}