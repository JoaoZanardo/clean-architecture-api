import { HttpResponse } from "./http";

export interface Router<T = any> {
    route(httpRequest: T): Promise<HttpResponse>;
}