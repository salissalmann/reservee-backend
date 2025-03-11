interface Env {
    DATABASE_URL: string;
    SENDGRID_API_KEY: string;
    JWT_SECRET: string;
    JWT_SECRET_EXPIRY_IN_DAYS: string;
    CLOUDFLARE_R2_BUCKET: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    NODE_ENV: string;
    RESERVEE_BUCKET: R2Bucket;
    RESERVEE_API: Fetcher; 
}

interface Fetcher {
    fetch(request: Request): Promise<Response>;
}
