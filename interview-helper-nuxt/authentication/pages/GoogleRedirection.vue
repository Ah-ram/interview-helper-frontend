<template>
    <div>Google Login 중입니다!</div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useAuthenticationStore } from "../stores/authenticationStore";

export default defineComponent({
    setup() {
        const route = useRoute()
        const router = useRouter()
        const authenticationStore = useAuthenticationStore()
        const code = route.query.code
        const scope = route.query.scope

        async function setUserToken() {
            console.log("code:", code)
            const accessToken = await authenticationStore.requestGoogleAccessTokenToSpringRedirection(code)
            console.log("accessToken:", accessToken)
            const userinfo = await authenticationStore.requestGoogleUserinfoToSpring(accessToken)
            console.log("userinfo:", userinfo)
            console.log("userinfo id:", userinfo.id)
            const userToken = await authenticationStore.requestUserTokenToSpring(userinfo)
            localStorage.setItem('userToken', userToken)
            router.push('/')
        }

        onMounted(async () => {
            await setUserToken()
        })

        return {}
    }
})
</script>