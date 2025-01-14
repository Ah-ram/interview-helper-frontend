<template>
  <div class="page-wrapper">
    <div class="mypage-container">
      <div class="profile-section">
          <div class="profile-layout">
              <div class="profile-image-container">
                  <ProfileImageEdit
                      :current-profile-image="userInfo.picture"
                  />
              </div>
              
              <div class="info-content">
                  <div class="tab-navigation">
                      <button class="tab-button active">
                          회원 정보
                      </button>
                  </div>
                  
                  <div class="profile-details">
                      <div class="info-row">
                          <div class="info-label">이메일</div>
                          <div class="info-value disabled">
                              {{ userInfo.email }}
                          </div>
                      </div>
                      
                      <div class="info-row">
                          <div class="info-label">닉네임</div>
                          <NicknameEdit
                              :current-nickname="userInfo.nickname"
                              @update:nickname="handleNicknameChange"
                          />
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserProfileStore } from '../stores/UserProfileStore';
import NicknameEdit from '../components/NicknameEdit.vue';
import ProfileImageEdit from '../components/ProfileImageEdit.vue';

const userProfileStore = useUserProfileStore();

const userInfo = ref({
  nickname: '',
  email: '',
  picture: ''
})

const getUserInfo = async () => {
  const response = await userProfileStore.requestUserInfoToSpring()
  userInfo.value = {
      nickname: response.nickname || null,
      email: response.email || null,
      picture: response.picture 
  }
}

async function handleNicknameChange(newNickname) {
  try {
    await userProfileStore.requestChangeNicknameToSpring(newNickname)
    userInfo.value.nickname = newNickname
  } catch (error) {
    console.error('닉네임 변경 실패:', error)
    throw new Error('이미 사용 중인 닉네임입니다.')
  }
  
}


onMounted(async () => {
  await getUserInfo();
})
</script>
  
<style scoped>
.page-wrapper {
  background-color: #121212;
  min-height: 100hv;
  width: 100%;
}

.mypage-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 20px;
    min-height: 100vh;
    background-color: #121212;
}

.profile-section {
    background: #1e1e1e;
    border-radius: 8px;
    width: 100%;
}

.profile-layout {
    display: flex;
    gap: 100px;
    align-items: flex-start;
    padding: 0 20px;
}

.profile-image-container {
    flex: 0 0 300px;
    margin-top: 40px; /* 상단 여백 추가 */
}

.info-content {
    flex: 1;
}

.tab-navigation {
    display: flex;
    border-bottom: 1px solid #404040;
    margin-top: 40px;
    margin-bottom: 40px;
    width: 100%;
}

.tab-button {
    padding: 16px 24px;
    font-size: 16px;
    color: #a0a0a0;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
}

.tab-button.active {
    color: #2563eb;
    font-weight: 600;
}

.tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #2563eb;
}

.profile-details {
    width: 80%;
    margin-left: 40px;
}

.info-row {
    display: flex;
    padding: 24px 0;
    border-bottom: 1px solid #404040;
}

.info-label {
    width: 120px;
    color: #aaaaaa;
    font-weight: 500;
}

.info-value {
    flex: 1;
    color: #ffffff;
}

.info-value.disabled {
    color: #ffffff;
}

@media (max-width: 768px) {
    .profile-layout {
        flex-direction: column;
        align-items: center;
    }

    .profile-image-container {
        margin-bottom: 24px;
    }

    .right-content {
        width: 100%;
    }

    .info-row {
        flex-direction: column;
        gap: 8px;
    }

    .info-label {
        width: 100%;
    }
}
</style>