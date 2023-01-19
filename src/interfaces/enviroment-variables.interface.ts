export interface EnvironmentVariablesInterface {
    APPLICATION_PORT: number;
    UPLOADED_FILES_DESTINATION: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_PUBLIC_BUCKET_NAME: string;
    AWS_ENDPOINT_URL: string;
    AWS_REGION: string;
}
