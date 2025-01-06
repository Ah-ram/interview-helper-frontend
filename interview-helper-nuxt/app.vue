<template>
    <v-app>
        <v-main>
            <v-app-bar class="navigationbar" :class="{ 'scrolled': isScrolled }" :height="isScrolled ? 50 : 70" color="#1a1a1a" elevation="0">
                <v-spacer>
                    <v-btn class="btn-text">
                        <span>INTERVIEW-HELPER</span>
                    </v-btn>
                </v-spacer>

                <v-spacer align="right">
                    <v-btn class="btn-text" @click="goToInterview" alt="INTERVIEW">
                        <span>INTERVIEW</span>
                    </v-btn>
                    <v-btn class="btn-text" @click="goToBoardList" alt="BOARD">
                        <span>BOARD</span>
                    </v-btn>

                    <v-btn class="btn-text" v-if="isAuthenticated == false" @click="goToGoogleLogin" alt="GoogleLogin">
                        <span>LOGIN</span>
                    </v-btn>

                    <v-btn class="btn-text" v-if="isAuthenticated == true" @click="goToGoogleLogout" alt="GoogleLogout">
                        <span>LOGOUT</span>
                    </v-btn>
                </v-spacer>
            </v-app-bar>
            <NuxtPage />
            <!--            <NuxtLink to="/">Home</NuxtLink>-->
        </v-main>
    </v-app>
</template>

<script>
// import router from '~/router/index.ts'
import { defineComponent, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthenticationStore } from './authentication/stores/authenticationStore';

export default defineComponent({
    setup() {
        const route = useRoute()
        const router = useRouter()
        const authenticationStore = useAuthenticationStore()

        const isScrolled = computed(() => {
            if (path.value !== '/') {
                return false;
            } else {
                return Yscrolled.value > 50;
            }
        })
        const isAuthenticated = computed(() => authenticationStore.isAuthenticated)
        const path = computed(() => route.path)
        const Yscrolled = ref(0)

        function goToBoardList() {
            router.push("/board/list")
        }

        function goToInterview() {
            router.push("/interview/category")
        }

        async function goToGoogleLogin() {
            await authenticationStore.requestGoogleOauthRedirectionToSpring();
        }

        async function goToGoogleLogout() {
            await authenticationStore.requestGoogleLogoutToSpring();
            router.push("/")
        }

        function handleScroll() {
            Yscrolled.value = window.scrollY
        }

        onMounted(async () => {
            if (authenticationStore.isAuthenticated != undefined) {

                if (!authenticationStore.isAuthenticated) {
                    localStorage.removeItem('userToken')
                }
            }

            window.addEventListener('scroll', handleScroll)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('scroll', handleScroll)
        })

        return {
            isScrolled,
            isAuthenticated,

            goToBoardList,
            goToInterview,
            goToGoogleLogin,
            goToGoogleLogout,
            handleScroll,
        }
    }
})
</script>

<style scoped>
.btn-text {
    color: white;
    font-size: 0.75rem;
}

</style>
