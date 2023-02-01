import { AddAccount } from "../../domain/usecases";
import { Encrypter } from "../protocols/cryptography";
import { AddAccountRepository, LoadUserByEmailRepository } from "../protocols/db";

export class AddAcountUseCaseService implements AddAccount {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepository,
        private addAccountRepository: AddAccountRepository,
        private Encrypter: Encrypter
    ) { }

    async add(params: AddAccount.Params): Promise<AddAccount.Result> {
        const exists = await this.loadUserByEmailRepo.load(params.email);
        let isValid = false
        if (!exists) {
            const hashedPassword = await this.Encrypter.hash(params.password);
            isValid = await this.addAccountRepository.add({ ...params, password: hashedPassword });
        }
        return isValid;
    }
}