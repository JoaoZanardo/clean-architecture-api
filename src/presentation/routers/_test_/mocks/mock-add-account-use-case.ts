import { AddAccount } from "../../../../domain/usecases/add-account";

export class AddAccountUseCaseSpy {
    public isValid: boolean = true;
    async add(params: AddAccount.Params): Promise<AddAccount.Result> {
        return this.isValid;
    }
}