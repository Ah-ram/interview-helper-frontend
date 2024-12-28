import { tryUseNuxtApp } from "nuxt/app";
import * as axiosUtility from "../../utility/axiosInstance"
import { useAuthenticationStore } from "./authenticationStore"

export const authenticationActions = {
    async requestGoogleOauthRedirectionToSpring(): Promise<void> {
        const { springAxiosInst } = axiosUtility.createAxiosInstances()
        try {
            return await springAxiosInst.get("/oauth/login").then((res) => {
                window.location.href = res.data.url
            })
        } catch (error) {
            console.error("requestGoogleOauthRedirectionToSpring() 중 오류 발생!", error)
        }
    },
    async requestUserTokenToSpring(): Promise<any> {
        const { springAxiosInst } = axiosUtility.createAxiosInstances()
        const authenticationStore = useAuthenticationStore()
        
        try {
            const response = await springAxiosInst.get("/oauth/login-success")
        }
    }
}