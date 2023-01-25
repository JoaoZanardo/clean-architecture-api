import { AddAccount } from "../../../../domain/usecases/add-account";

export class AddAccountUseCaseSpy {
    async add(params: AddAccount.Params): Promise<AddAccount.Result> {
        return false;
    }
}