import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface RequestOptions extends AxiosRequestConfig {
    stream?: boolean;
}

interface RequestResult {
    request: {
        url: string;
        options: RequestOptions;
    };
    status: number;
    statusText: string;
    url: string;
    error: string[];
    headers: Record<string, any>;
    toString: () => string;
    raw: () => AxiosResponse;
    text: () => string;
    json: () => any;
}

export default class PromiseRequest {
    private url: string;
    private options: RequestOptions;

    constructor(url: string, options: RequestOptions) {
        this.url = url;
        this.options = options;
    }

    async request(): Promise<RequestResult> {
        if (this.options.stream) {
            console.warn("Stream mode is not supported in React Native. Ignoring 'stream' option.");
        }

        try {
            const response = await axios(this.url, this.options);
            const request = {
                url: this.url,
                options: this.options,
            };

            let redirectUrl = this.url;
            try {
                redirectUrl = response?.request?.responseURL || this.url;
            } catch {
                redirectUrl = this.url;
            }

            const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
            let json: any = response.data;

            try {
                json = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            } catch {
                // Если ошибка, возвращем json
            }

            const stringified = `Status: ${response.status} ${response.statusText}\nURL: ${this.url}\nHeaders: ${JSON.stringify(
                response.headers
            )}\nBody: ${text}`;

            const result: RequestResult = {
                request,
                status: response.status,
                statusText: response.statusText,
                url: redirectUrl,
                error: [],
                headers: response.headers,
                toString: () => stringified,
                raw: () => response,
                text: () => text,
                json: () => json,
            };

            return result;
        } catch (error: any) {
            const message = error?.message || 'Unknown error';
            throw new Error(`Request failed: ${message}`);
        }
    }
}
