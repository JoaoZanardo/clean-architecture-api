import jwt from "jsonwebtoken";
import { TokenGenerator } from "../interfaces/token-generator";

export class Jwt implements TokenGenerator {
    constructor(private secret: string) { }

    generate(payload: string): string | null {
        return jwt.sign(payload, this.secret);
    }
}