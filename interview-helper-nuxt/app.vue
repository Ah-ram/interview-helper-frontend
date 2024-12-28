<template>
    <v-app>
        <v-main>
            <v-app-bar class="navigationbar" :class="{ 'scrolled': isScrolled }" :height="isScrolled ? 50 : 70">
                <v-spacer>
                    <v-btn @click="goToBoardList" alt="BOARD">
                        <span>BOARD</span>
                    </v-btn>

                    <v-btn v-if="isAuthenticated" @click="goToGoogleLogin" alt="GoogleLogin">
                        <span>LOGIN</span>
                    </v-btn>

                    <v-btn v-else @click="goToGoogleLogout" alt="GoogleLogout">
                        <span>LOGOUT</span>
                    </v-btn>
                </v-spacer>
            </v-app-bar>
            <NuxtPage/>
<!--            <NuxtLink to="/">Home</NuxtLink>-->
        </v-main>
    </v-app>
</template>

<script setup>
// import router from '~/router/index.ts'
import { defineComponent, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const route = useRoute()
        const router = useRouter()
        
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

        async function goToGoogleLogin() {
            await authenticationStore.requestGoogleOauthRedirectionToSpring();
        }

        function goToGoogleLogout() {
            router.push("/oauth/logout")
        }

        function handleScroll() {
            Yscrolled.value = window.scrollY
        }

        onMounted(async () => {
            if (authenticationStore.isAuthenticated != undefined) {
                await authenticationStore.requestUserTokenValidationToSpring()

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
            goToGoogleLogin,
            goToGoogleLogout,
            handleScroll,
        }
    }
})
</script>

<style scoped>
</style>
