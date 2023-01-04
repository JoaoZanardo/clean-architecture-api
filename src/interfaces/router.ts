interface HttpResponse {
    statusCode: number;
    body?: any;
}

interface Body {
    email?: string;
    password?: string;
}

export interface HttpRequest {
    body: Body
}

export interface Router {
    route(httpRequest: HttpRequest): Promise<HttpResponse>;
}