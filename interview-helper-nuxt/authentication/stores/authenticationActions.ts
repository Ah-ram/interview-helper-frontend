import { tryUseNuxtApp } from "nuxt/app";
import * as axiosUtility from "../../utility/axiosInstance"
import { useAuthenticationStore } from "./authenticationStore"

export const authenticationActions = {
    async requestGoogleOauthRedirectionToSpring(): Promise<void> {
        const { springAxiosInst } = axiosUtility.createAxiosInstances()
        try {
            return await springAxiosInst.get("/oauth/google").then((res) => {
                console.log("redirect uri:", res)
                window.location.href = res.data
            })
        } catch (error) {
            console.error("requestGoogleOauthRedirectionToSpring() 중 오류 발생!", error)
        }
    },
    async requestGoogleAccessTokenToSpringRedirection(code: string): Promise<void> {
        const { springAxiosInst } = axiosUtility.createAxiosInstances()
        const authenticationStore = useAuthenticationStore()
        
        try {
            const response = await springAxiosInst.post("/oauth/google/access-token",
                { code: code }, { headers: { 'Content-Type': 'application/json' } })
            console.log("requestGoogleAccessTokenToSpringRedirection() response:", response)
            authenticationStore.isAuthenticated = true
            return response.data
        } catch (error) {
            console.error("requestGoogleAccessTokenToSpringRedirection() 중 오류 발생:", error)
        }
    },
    async requestGoogleUserinfoToSpring(accessToken: string): Promise<any> {
        const { springAxiosInst } = axiosUtility.createAxiosInstances()
        
        try {
            const response = await springAxiosInst.post("/oauth/google/userinfo", 
                { accessToken: accessToken }, { headers: { 'Content-Type': 'application/json' } })
            console.log("requestGoogleUserinfoToSpring() response:", response)
            return response.data
        } catch (error) {
            console.error("requestGoogleUserinfoToSpring() 중 오류 발생:", error)
        }
    },
    async requestUserTokenToSpring(userinfo: [string]) {
        const { springAxiosInst } = axiosUtility.createAxiosInstances()

        try {
            const response = await springAxiosInst.post("/oauth/google/redis-user-token", 
                { userinfo: userinfo }, { headers: { 'Content-Type': 'application/json' } })
            console.log("requestUserTokenToSpring() response:", response)
            return response.data
        } catch (error) {
            console.error("requestUserTokenToSpring() 중 오류 발생:", error)
        }
    },
    async requestGoogleLogoutToSpring() {
        const { springAxiosInst } = axiosUtility.createAxiosInstances()
        const authenticationStore = useAuthenticationStore()

        try {
            const userToken = localStorage.getItem("userToken")
            await springAxiosInst.post(
                "oauth/google/delete-redis-user-token", { userToken: userToken }
            )
            authenticationStore.isAuthenticated = false
            localStorage.removeItem("userToken")
        } catch (error) {
            console.error("requestGoogleLogoutToSpring() 중 오류 발생:", error)
        }
    }
}