import { TokenGenerator } from "../../../../interfaces/token-generator";

export class TokenGeneratorSpy implements TokenGenerator {
    public id: string = '';

    generate(id: string): string | null {
        this.id = id;
        return 'valid_token';
    }
}