import { AddAccountRepository } from "src/data/protocols/db";
import mongoHelper from "../helpers/mongo-helper";

export class MongoAddAccountRepository {
    async add(params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
        const userModel = await mongoHelper.getCollection('users');
        const user = await userModel.insertOne({ ...params });
        return !!user.insertedId;
    }
}