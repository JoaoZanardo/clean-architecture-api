export interface Auth{
    auth: (params: Auth.Params) => Promise<Auth.Result>;
}

export namespace Auth {
    export type Params = {
        email: string,
        password: string
    };

    export type Result = null | string
}