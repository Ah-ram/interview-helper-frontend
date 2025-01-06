// env.ts
export interface Env {
    mode: string | undefined;
    api: {
        MAIN_API_URL: string | undefined;
        AI_BASE_URL: string | undefined;
    };
}

const env: Env = {
    mode: process.env.MODE_ENV,
    api: {
        MAIN_API_URL: process.env.NUXT_PUBLIC_BASE_URL,
        AI_BASE_URL: process.env.NUXT_PUBLIC_AI_BASE_URL,
    },
};

export default env; // 필요하다면 다른 곳에서 사용하기 위해 남겨둡니다.
