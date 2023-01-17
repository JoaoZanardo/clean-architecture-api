import { UpdateAccessTokenRepository } from "../../data/protocols/db";
import mongoHelper from "../helpers/mongo-helper";

export class MongoDBUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    async update(userId: string, accessToken: string | null): Promise<void> {
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