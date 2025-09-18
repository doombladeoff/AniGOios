import promise_request_1 from '@/API/Crunchyroll/promise-request';
// import UserAgents from 'user-agents';
import { CmsSignatureResponse, CrunchyConstructorProps, LoginResult, TokenResponse } from './Crunchroll.interfaces';

export class Crunchy {
    private api: string;
    private main: string;
    private token: string = 'a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=';
    private email: string;
    private password: string;

    public accessToken: string | null = null;
    public refreshToken: string | null = null;
    public accountId: string | null = null;

    public signature: string | null = null;
    public key_pair_id: string | null = null;
    public bucket: string | null = null;
    public policy: string | null = null;

    constructor({ email, password, token }: CrunchyConstructorProps) {
        this.email = email;
        this.password = password;
        this.token = token ?? 'a3ZvcGlzdXZ6Yy0teG96Y21kMXk6R21JSTExenVPVnRnTjdlSWZrSlpibzVuLTRHTlZ0cU8=';
        this.api = 'https://beta-api.crunchyroll.com';
        this.main = 'https://www.crunchyroll.com';
    }

    public async login(): Promise<LoginResult> {
        const credentials = `xunihvedbt3mbisuhevt:1kIS5dyTvjE0_rqaA3YeAh0bUXUmxW11`;
        const base64data = btoa(credentials);

        const params = new URLSearchParams();
        params.append('grant_type', 'client_id');
        params.append('scope', 'offline_access');

        // const userAgent = new UserAgents();

        const req = new promise_request_1(`${this.api}/auth/v1/token`, {
            data: params,
            headers: {
                // 'User-Agent': userAgent.toString(),
                Authorization: `Basic ${base64data}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'ETP-Anonymous-ID': null,
            },
            method: 'POST',
        });

        const res = await req.request().catch(() => {
            throw new Error(`Ошибка логина`);
        });

        if (res.status !== 200) throw new Error(res.toString());

        const response = (await res.json()) as TokenResponse;

        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.accountId = response.account_id;

        const sigReq = new promise_request_1(`${this.api}/index/v2`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });

        const sig = await sigReq.request().catch(() => {
            throw new Error(`Запрос к /index/v2 не удался`);
        });

        const signature = (await sig.json()) as CmsSignatureResponse;

        if (!signature?.cms) throw new Error(`Недопустимая CMS подпись`);

        this.signature = signature.cms.signature;
        this.key_pair_id = signature.cms.key_pair_id;
        this.bucket = signature.cms.bucket;
        this.policy = signature.cms.policy;

        return {
            ...response,
            signature: this.signature,
            key_pair_id: this.key_pair_id,
            bucket: this.bucket,
            policy: this.policy,
        };
    }

    public async search(query: string, amount: number = 8): Promise<any> {
        const url = `${this.api}/content/v2/discover/search?q=${encodeURIComponent(query)}&n=${amount}&type=&locale=en-EN`;

        const req = new promise_request_1(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                Referer: this.main,
            },
        });

        const search = await req.request().catch(() => {
            throw new Error(`Ошибка поиска: ${url}`);
        });

        if (search.status !== 200) throw new Error(search.toString());

        return search.json();
    }

    public async queryShowData(
        id: string,
        locale: 'en_EN' | 'ru_RU',
        mediaType: 'series',
        token: string
    ): Promise<any> {
        console.log(token)
        const url = `${this.api}/content/v2/cms/${mediaType}/${id}?locale=${locale}`;

        const req = new promise_request_1(url, {
            headers: {
                Authorization: `Bearer ${token ? token : this.accessToken}`,
                Referer: this.main,
            },
        });

        const cr_data = await req.request().catch(() => {
            throw new Error(`Ошибка получения данных: ${id}`);
        });

        return cr_data.json();
    }
}
