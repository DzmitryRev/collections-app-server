export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGO_DB_URL: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_EMAIL_SECRET: string;
      JWT_PASSWORD_SECRET: string;
      API_URL: string;
      CLIENT_URL: string;
      GMAIL_USER: string;
      GMAIL_PASSWORD: string;
    }
  }
}
