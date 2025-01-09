import axios, { AxiosInstance } from "axios";

let springAxiosInst: AxiosInstance | null = null;
let fastapiAxiosInst: AxiosInstance | null = null;

export function createAxiosInstances() {
    if (!springAxiosInst) {
        const config = useRuntimeConfig();
        springAxiosInst = axios.create({
            baseURL: config.public.MAIN_API_URL,
            timeout: 10000,
        });
        console.log("Spring API URL:", config.public.MAIN_API_URL);

    }

    if (!fastapiAxiosInst) {
        const config = useRuntimeConfig();
        fastapiAxiosInst = axios.create({
            baseURL: config.public.AI_BASE_URL,
            timeout: 10000,
        });
    }

    return { springAxiosInst, fastapiAxiosInst };
}
