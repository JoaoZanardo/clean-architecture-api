import { UpdateAccessTokenRepository } from "../../../../interfaces/update-access-token-repository";
import { LoadUserByEmailRepository } from "../../../../interfaces/load-user-by-email-repository";
import { User } from "../../../../interfaces/user";

export class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository<User | null> {
    public user: null | User = { id: 'any_id', password: 'any_password' };

    async load(email: string): Promise<User | null> {
        return this.user
    }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {

    async update(userId: string, token: string | null): Promise<void> {
        return;
    }
}

