<template>
    <div class="nickname-section">
        <div v-if="!isEditing" class="input-group">
            <span class="nickname">{{ currentNickname }}</span>
            <button @click="startEditing" class="edit-nickname-btn start">변경</button>
        </div>
        <div v-else class="edit-mode-container">
            <div class="input-group">
                <input 
                    v-model="newNickname"
                    type="text"
                    class="nickname-input"
                    :class="{ 'error': hasError }"
                    :disabled="isChecking"
                />
                <div class="action-btn">

                    <button
                        v-if="!isNicknameChecked"
                        @click="checkNicknameDuplicate"
                        class="check-btn"
                        :disabled="!isValidLength || isChecking || newNickname === currentNickname"
                    >
                        {{ isChecking ? '확인중...' : '중복확인' }}
                    </button>
                    <button 
                        v-if="isNicknameChecked"
                        @click="handleSubmit"
                        class="edit-nickname-btn submit"
                        :disabled="!canSubmit"
                    >
                        변경
                    </button>
                    <button
                        @click="cancelEditing"
                        class="edit-nickname-btn cancel"
                    >
                        취소
                    </button>
                </div>
            </div>
            <!--중복확인 성공 시 변경 버튼 표시-->
            <div v-if="isNicknameChecked" class="success-group">
                    
                <span class="check-success">✓ 사용 가능한 닉네임입니다</span>
            </div>
            <p v-if="hasError" class="error-message">{{ errorMessage }}</p>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useUserProfileStore } from '../stores/UserProfileStore'
  
  const userProfileStore = useUserProfileStore()

  const props = defineProps({
    currentNickname: {
      type: String,
      required: true
    }
  })
  
  const emit = defineEmits(['update:nickname'])
  
  const isEditing = ref(false)
  const newNickname = ref('')
  const hasError = ref(false)
  const errorMessage = ref('')
  const isChecking = ref(false)
  const isNicknameChecked = ref(false)
  
  const isValidLength = computed(() => {
    return newNickname.value.length >= 2 && newNickname.value.length <= 20
  })
  
  const canSubmit = computed(() => {
    return isValidLength.value && 
           isNicknameChecked.value && 
           !isChecking.value &&
           !hasError.value
  })

  const startEditing = () => {
    newNickname.value = props.currentNickname
    isEditing.value = true
    hasError.value = false
    isNicknameChecked.value = false
  }
  
  const checkNicknameDuplicate = async () => {
    if (!isValidLength.value) {
      hasError.value = true
      errorMessage.value = '닉네임은 2-20자 사이여야 합니다.'
      return
    }
  
    if (newNickname.value === props.currentNickname) {
      hasError.value = true
      errorMessage.value = '현재 사용 중인 닉네임과 동일한 닉네임입니다.'
      return
    }
  
    try {
        isChecking.value = true
        hasError.value = false
        const response = await userProfileStore.requestNicknameDuplicationCheckToSpring(newNickname.value)

        if (response) {
            hasError.value = true // true면 중복
            errorMessage.value = '이미 사용 중인 닉네임입니다.'
            isNicknameChecked.value = false
        } else {
            hasError.value = false
            isNicknameChecked.value = true
        }
    } catch (error) {
        hasError.value = true
        errorMessage.value = '중복 확인 중 오류가 발생했습니다.'
        isNicknameChecked.value = false
    } finally {
        isChecking.value = false
    }
  }

  const handleSubmit = async() => {
    if (!canSubmit.value) return
    
    try {
        emit('update:nickname', newNickname.value)
        isEditing.value = false
        isNicknameChecked.value = false
        hasError.value = false
    } catch (error) {
        hasError.value = true
        errorMessage.value = error.message || '닉네임 변경 중 오류가 발생했습니다.'
    }
  }

  const cancelEditing = () => {
    isEditing.value = false
    newNickname.value = ''
    hasError.value = false
    isNicknameChecked.value = false
  }
  </script>

 

<style scoped>
.nickname-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.edit-mode-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.success-group {
    display: flex;
    gap: 0.5rem;
}

.nickname-input {
  padding: 4px 8px;
  border: 1px solid #a0a0a0;
  border-radius: 4px;
  color: #808080;
  font-size: 1rem;
  font-weight: 500;
  min-width: 200px;
}

.nickname-input:focus {
  outline: none;
}

.nickname-input.error {
  border-color: #f44336;
}

.action-btn {
    display: flex;
    gap: 0.75rem;
}

.check-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  background-color: #3a3a3a;
  border: 1px solid #3a3a3a;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
}

.check-btn:hover {
    background-color: #2563eb;
}

.check-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.check-success {
  color: #2563eb;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.nickname {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
}

.edit-nickname-btn.start {
    margin-left: 300px;
}

.edit-nickname-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  background-color: #f5f5f5;
  border: 1px solid #a0a0a0;
  font-size: 0.8rem;
  cursor: pointer;
  color: #333333;
}

.edit-nickname-btn:hover {
  background-color: #eeeeee;
}

.edit-nickname-btn.submit {
  background-color: #3a3a3a;
  border: 1px solid #3a3a3a;
  color: white;
}

.edit-nickname-btn.submit:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.edit-nickname-btn.cancel {
    background-color: #f5f5f5;
    border: 1px solid #a0a0a0;
    color: #333333;
}

.edit-nickname-btn.cancel:hover {
    background-color: #eeeeee;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
}

</style>