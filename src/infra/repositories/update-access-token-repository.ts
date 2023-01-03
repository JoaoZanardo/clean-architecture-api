import { Collection, Document } from "mongodb";
import { UpdateAccessTokenRepository } from "src/interfaces/update-access-token-repository";

export class DbUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    constructor(private userModel: Collection<Document>) { }

    async update(userId: string, accessToken: string): Promise<void> {
        await this.userModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    accessToken
                }
            });
    }
}