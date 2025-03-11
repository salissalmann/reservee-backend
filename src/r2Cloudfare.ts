import { S3Client } from '@aws-sdk/client-s3';

/**
 * Creates a Cloudflare R2 client using the provided environment variables.
 * @param env - Environment variables containing Cloudflare R2 credentials and configuration.
 * @returns A configured S3Client instance for Cloudflare R2.
 * @throws Error if required environment variables are missing.
 */
export function createR2Client(env: Record<string, string | undefined>): S3Client {
    const {
        CLOUDFLARE_R2_ENDPOINT,
        CLOUDFLARE_R2_ACCESS_KEY_ID,
        CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    } = env;

    if (!CLOUDFLARE_R2_ENDPOINT || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
        throw new Error("Missing Cloudflare R2 configuration in environment variables");
    }

    return new S3Client({
        endpoint: CLOUDFLARE_R2_ENDPOINT, // Cloudflare R2 endpoint
        region: 'auto', // Cloudflare R2 doesn't require a specific region
        credentials: {
            accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
            secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true, // Required for Cloudflare R2 compatibility
    });
}
