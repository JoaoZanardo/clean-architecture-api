import { TokenGenerator } from "../../protocols/cryptography";

export class TokenGeneratorSpy implements TokenGenerator {

    generate(id: string): string | null {
        return 'valid_token';
    }
}