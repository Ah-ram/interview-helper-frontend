<template>
    <div class="profile-container">
      <div class="profile-image-container">
        <div class="profile-image">
          <img 
            :src="userInfo.picture" 
            alt="프로필 이미지"
            class="rounded-image"
          />
          <button class="edit-image-btn" @click="handleImageChange">
            <span class="pencil-icon">✎</span>
          </button>
        </div>
      </div>
      
      <div class="profile-info">
        <div class="email-section">
          <span class="email">{{ userInfo.email }}</span>
        </div>
        
        <div class="nickname-section">
          <span class="nickname">{{ userInfo.nickname }}</span>
          <button class="edit-nickname-btn" @click="handleNicknameChange">
            변경
          </button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router';
  import { useUserProfileStore } from '../stores/UserProfileStore';
  
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

  async function handleImageChange(picture) {

  }

  async function handleNicknameChange(nickname) {
    
  }


  onMounted(async () => {
    await getUserInfo();
  })
  </script>
  
  <style scoped>
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  
  .profile-image-container {
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .profile-image {
    position: relative;
    width: 120px;
    height: 120px;
  }
  
  .rounded-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .edit-image-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .pencil-icon {
    font-size: 16px;
    color: #666666;
  }
  
  .profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .email-section {
    margin-bottom: 0.5rem;
  }
  
  .email {
    font-size: 0.9rem;
    color: #666666;
  }
  
  .nickname-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .nickname {
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .edit-nickname-btn {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    font-size: 0.8rem;
    cursor: pointer;
    color: #333333;
  }
  
  .edit-nickname-btn:hover {
    background-color: #eeeeee;
  }
  </style>