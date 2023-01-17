import { UserModel } from "../models";

export interface LoadUserByEmailRepository {
    load: (email: string) => Promise<UserModel | null>;
}