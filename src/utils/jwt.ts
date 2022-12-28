import jwt from "jsonwebtoken";
import { TokenGenerator } from "../interfaces/token-generator";

export class Jwt implements TokenGenerator {
    constructor(private secret: string) { }

    generate(id: string): string | null {
        return jwt.sign(id, this.secret);
    }
}