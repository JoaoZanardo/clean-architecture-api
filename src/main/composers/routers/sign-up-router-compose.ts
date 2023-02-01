import { SignUpRouter } from "../../../presentation/routers";
import { SignUpRouteValidationCompose } from "../validations";
import { AuthUseCaseComposer } from "../usecases";
import { AddAcountUseCaseComposer } from "../usecases";

export class SignUpRouterCompose {
    static compose() {
        const authUseCase = AuthUseCaseComposer.compose();
        const addAccountUseCase = AddAcountUseCaseComposer.compose();
        const validator = SignUpRouteValidationCompose.compose();
        return new SignUpRouter(
            validator,
            addAccountUseCase,
            authUseCase
        );
    }
}