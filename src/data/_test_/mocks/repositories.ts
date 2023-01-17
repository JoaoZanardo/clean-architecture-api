import { UpdateAccessTokenRepository, LoadUserByEmailRepository } from "../../protocols/db";
import { UserModel } from "../../protocols/models";

export class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository {
    public user: null | UserModel = { id: 'any_id', password: 'any_password' };

    async load(email: string): Promise<UserModel | null> {
        return this.user
    }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {

    async update(userId: string, token: string | null): Promise<void> {
        return;
    }
}