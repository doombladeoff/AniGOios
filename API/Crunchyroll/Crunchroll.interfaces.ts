export interface CrunchyConstructorProps {
    email: string;
    password: string;
    token?: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    country: string;
    account_id: string;
}

export interface CmsSignatureResponse {
    cms: {
        signature: string;
        key_pair_id: string;
        bucket: string;
        policy: string;
    };
}

export interface LoginResult extends TokenResponse {
    signature: string;
    key_pair_id: string;
    bucket: string;
    policy: string;
}
