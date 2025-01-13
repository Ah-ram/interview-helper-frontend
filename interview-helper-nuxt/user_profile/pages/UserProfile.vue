<template>
    <div class="mypage-container">
        <div class="profile-section">
            <div class="profile-header">
                <div class="profile-info">
                    <div class="profile-image">
                        <img :src="userInfo.picture" alt="Profile" />
                    </div>
                    <div class="profile-text">
                        <h1>{{ userInfo.nickname }}</h1>
                        <p>{{ userInfo.email }}</p>
                    </div>
                </div>
                <button @click="logOut" class="logout-button">로그아웃</button>
            </div>
        </div>
        <div class="button-grid">
            <NuxtLink to="/user-profile/info" class="menu-button">
                <div class="button-content">
                    <h3>내 정보</h3>
                    <span class="arrow">→</span>
                    <p>개인정보를 관리하세요</p>
                </div>
            </NuxtLink>
            
            <NuxtLink to="/" class="menu-button">
                <div class="button-content">
                    <h3>저장된 질문</h3>
                    <span class="arrow">→</span>
                    <p>내가 저장한 질문을 확인하세요</p>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserProfileStore } from '../stores/UserProfileStore' 
import { useAuthenticationStore } from '@/authentication/stores/authenticationStore'

const router = useRouter()
const authenticationStore = useAuthenticationStore();
const userProfileStore = useUserProfileStore()
const userInfo = ref({
    nickname: '',
    email: '',
    picture: ''
})

const getNickname = async () => {
    const response = await userProfileStore.requestUserInfoToSpring()
    userInfo.value = {
        nickname: response.nickname || null,
        email: response.email || null,
        picture: response.picture 
    }
}

const logOut = async () => {
    await authenticationStore.requestGoogleLogoutToSpring()
    
    router.push("/")
}

onMounted(async () => {
    if (!authenticationStore.isAuthenticated) {
        if (confirm("로그인 하시겠습니까?")) {
            await authenticationStore.requestGoogleOauthRedirectionToSpring()
        } else {
            router.push("/")
        }
    }
    await getNickname();
})
</script>

<style scoped>
.mypage-container {
    margin: 0 auto;
    padding: 100px;
    min-height: 100vh;
    background-color: #1a1a1a;
}

.profile-section {
    background: #1e1e1e;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.profile-info {
    display: flex;
    align-items: center;
    gap: 20px;
}

.profile-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
}

.profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-text h1 {
    color: white;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
}

.profile-text p {
    color: #aaaaaa;
}

.button-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.menu-button {
    background: #242424;
    border-radius: 10px;
    padding: 20px;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s, box-shadow 0.2s;
}

.menu-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.button-content {
    position: relative;
}

.button-content h3 {
    color: white;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.arrow {
    color: #bbbbbb;
}

.button-content p {
    font-size: 14px;
    color: #aaaaaa;
}

.logout-button {
    background: #2563eb;
    border: none;           
    border-radius: 10px;
    margin-right: 15px;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
}
</style>