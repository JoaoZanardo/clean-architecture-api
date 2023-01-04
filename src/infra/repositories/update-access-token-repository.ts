import { UpdateAccessTokenRepository } from "src/interfaces/update-access-token-repository";
import env from "../../main/config/env";
import mongoHelper from "../helpers/mongo-helper";

export class DbUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    async update(userId: string, accessToken: string): Promise<void> {
        await mongoHelper.connect(env.mongoUrl);
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