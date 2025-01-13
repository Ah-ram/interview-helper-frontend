<template>
    <div class="profile-container">
      <div class="profile-image-container">
        <div class="profile-image">
          <img 
            :src="newProfileImage"
            alt="user-picture"
            class="rounded-image"
          />
          <button
            class="edit-image-btn"
            @click="openFileDialog"
            :disabled="isUploading"
          >
            <span v-if="!isUploading" class="pencil-icon">✎</span>
            <span v-else class="loading-icon">●</span>
          </button>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useUserProfileStore } from '../stores/UserProfileStore';
import { useAwsS3Config } from '../../utility/awsFileS3Config';
import {
    PutObjectCommand,
    ListObjectsCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectAclCommand,
    ObjectCannedACL
} from '@aws-sdk/client-s3'

const userProfileStore = useUserProfileStore()
const { s3Client } = useAwsS3Config()
const config = useRuntimeConfig()

const BUCKET_NAME = config.public.BUCKET_NAME
const AWS_REGION = config.public.AWS_REGION

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const props = defineProps({
    currentProfileImage: {
      type: String,
      required: true
    }
  })

let newProfileImage = computed(() => props.currentProfileImage)

function openFileDialog() {
    if (!isUploading.value && fileInput.value) {
      fileInput.value.click()
    }
  }

async function handleImageUpload(event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0];
    if (!file) return;

    // image 파일 타입 체크
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다!');
        input.value = '' // 파일 입력 초기화화
        return
    }

    try {
        isUploading.value = true

        const params = {
            Bucket: BUCKET_NAME,
            Key: `${Date.now()}-${file.name}`,
            Body: file,
        }

        await s3Client.send(new PutObjectCommand(params))

        const imageUrl = `${params.Key}`
        const response = await userProfileStore.requestChangePictureToSpring(imageUrl)
        newProfileImage = response
        userProfileStore.changedUserProfile = true
    } catch (error) {
        console.error('이미지 업로드 실패:', error)
    } finally {
        isUploading.value = false
        event.target.value = ''
    }

}
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
    width: 300px;
    height: 300px;
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
    background-color: #444;
    border: 1px solid #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .edit-image-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .pencil-icon {
    font-size: 16px;
    color: #aaaaaa;
  }
  
  .loading-icon {
    font-size: 16px;
    color: #aaaaaa;
    animation: rotate 1s linear infinite;
  }

  .hidden {
    display: none;
  }
</style>