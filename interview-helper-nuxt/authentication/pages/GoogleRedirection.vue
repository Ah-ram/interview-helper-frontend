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

        async function setUserToken() {
            const response = await authenticationStore.requestUserTokenToSpring()
            console.log("setUserToken response:", response)
            await localStorage.setItem('userToken', response.userToken)
            router.push('/')
        }

        onMounted(async () => {
            await setUserToken()
        })

        return {}
    }
})
</script>