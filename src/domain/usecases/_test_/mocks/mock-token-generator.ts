import { TokenGenerator } from "../../../../interfaces/token-generator";

export class TokenGeneratorSpy implements TokenGenerator {

    generate(id: string): string | null {
        return 'valid_token';
    }
}