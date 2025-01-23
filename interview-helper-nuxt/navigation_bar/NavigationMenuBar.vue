<template>
    <v-app-bar class="navigationbar" :class="{ 'scrolled': isScrolled }" :height="isScrolled ? 50 : 70" color="#1a1a1a" elevation="0">
        <v-spacer>
            <v-btn class="btn-text" @click="goToHome" alt="HOME">
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

            <v-btn class="btn-profile" v-if="isAuthenticated == true" @click="goToMyPage" alt="MyPage">
                <img :src="userPicture" alt="userPicture" class="profile-picture"/>
            </v-btn>
        </v-spacer>
     </v-app-bar>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useAuthenticationStore } from '../authentication/stores/authenticationStore';
import { useUserProfileStore } from '../user_profile/stores/UserProfileStore';
import { defineComponent, onBeforeUnmount, ref, computed, watch, onMounted } from 'vue';
import { useInterviewStore } from '../interview/stores/interviewStore';

export default defineComponent({
    setup() {
        const route = useRoute()
        const router = useRouter()
        const authenticationStore = useAuthenticationStore()
        const userProfileStore = useUserProfileStore()
        const interviewStore = useInterviewStore()

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
        const userPicture = ref(null)

        function goToHome() {
            router.push("/")
        }

        function goToBoardList() {
            router.push("/board/list")
        }

        async function goToInterview() {
            if (interviewStore.showQuestion) {
                interviewStore.showQuestion = false
            } else {
                router.push("/interview")
            }
        }

        async function goToGoogleLogin() {
            await authenticationStore.requestGoogleOauthRedirectionToSpring();
        }

        async function goToMyPage() {
            await router.push("/user-profile")
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

        watch(() => [authenticationStore.isAuthenticated, userProfileStore.changedUserProfile],
            async ([newValA, newValB]) => {
                if (newValA === true || newValB === true) {
                    try {
                        const response = await userProfileStore.requestUserInfoToSpring()
                        console.log("picture: ", response.picture)
                        userPicture.value = response.picture
                        console.log("userPicture.value: ", userPicture.value)
                        userProfileStore.changedUserProfile = false
                    } catch (error) {
                        console.error("UserPicture 가져오는 중 에러 발생: ", error)
                    }
                }
            }
        )

        return {
            isScrolled,
            isAuthenticated,
            userPicture,

            goToHome,
            goToBoardList,
            goToInterview,
            goToGoogleLogin,
            goToMyPage,
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

.btn-profile {
    padding: 0;
}

.profile-picture {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
}

</style>