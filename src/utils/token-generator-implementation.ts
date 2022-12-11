import jwt from "jsonwebtoken";
import { TokenGenerator } from "../interfaces/token-generator";

export class TokenGeneratorImplementation implements TokenGenerator {
    constructor(private secret: string) { }

    generate(id: string): string | null {
        return jwt.sign(id, this.secret);
    }
}