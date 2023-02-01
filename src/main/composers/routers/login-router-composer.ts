import { LoginRouter } from "../../../presentation/routers";
import { LoginRouterValidationCompose } from "../validations";
import { AuthUseCaseComposer } from "../usecases/";

export class LoginRouterCompose {
    static compose() {
        const authUseCase = AuthUseCaseComposer.compose();
        const validation = LoginRouterValidationCompose.compose()
        return new LoginRouter(authUseCase, validation);
    }
}