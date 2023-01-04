import { UpdateAccessTokenRepository } from "src/interfaces/update-access-token-repository";
import mongoHelper from "../helpers/mongo-helper";

export class DbUpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    async update(userId: string, accessToken: string): Promise<void> {
        await mongoHelper.connect(process.env.MONGO_URL as string);
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