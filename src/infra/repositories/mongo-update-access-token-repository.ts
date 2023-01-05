import { UpdateAccessTokenRepository } from "src/interfaces/update-access-token-repository";
import mongoHelper from "../helpers/mongo-helper";

export class MongoDBUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    async update(userId: string, accessToken: string): Promise<void> {
        const userModel = await mongoHelper.getCollection('users');
        await userModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    accessToken
                }
            });
    }
}