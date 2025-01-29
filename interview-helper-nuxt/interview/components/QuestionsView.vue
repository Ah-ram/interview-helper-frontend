<template>
  <div class="questions-view">
    <div class="category-header">
      <div class="selected-category">
        <button @click="toggleDropdown" class="dropdown-button">
          <span class="category-icon">{{ selectedCategory.icon }}</span>
          <span class="category-label">{{ selectedCategory.label }}</span>
          <span class="dropdown-arrow" :class="{ 'open': isDropdownOpen }">▼</span>
        </button>
        <v-btn elevation="0" class="refresh-button" @click="updateCategory">
          <v-icon left>mdi-refresh</v-icon>
        </v-btn>

        <div v-if="isDropdownOpen" class="dropdown-menu">
          <button v-for="category in categories" :key="category.id" @click="changeCategory(category)"
            :class="['dropdown-item', { active: selectedCategory?.id === category.id }]">
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-label">{{ category.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="question-section">
        <div class="questions-container">
          <!-- Single Question View -->
          <div v-if="generatedQuestions.length > 0 && currentIndex !== generatedQuestions.length" class="single-question">
            <div class="nav-container left">
              <button class="nav-button prev" @click="prevQuestion" :disabled="currentIndex === 0">
                &lt;
              </button>
            </div>
            <div class="question-card">
              <div class="question-number">질문 {{ currentIndex + 1 }}</div>
              <div class="question-content">{{ generatedQuestions[currentIndex] }}</div>
              <button 
                @click="checkQuestion(currentIndex)"
                class="favorite-button"
                :class="{ 'selected': isSelectedQuestion[currentIndex] }"
              >
                {{ isSelectedQuestion[currentIndex] ? '즐겨찾기 취소' : '즐겨찾기 추가' }}
                <v-icon right>{{ isSelectedQuestion[currentIndex] ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
              </button>
            </div>
            <div class="nav-container right">
              <button class="nav-button next" @click="nextQuestion" :disabled="currentIndex === generatedQuestions.length">
                &gt;
              </button>
            </div>
          </div>

          <!-- Final Questions Review -->
          <div v-else class="final-question-page">
            <h2 class="final-page-title">저장된 질문 확인</h2>
            <div class="questions-grid">
              <div v-for="(question, index) in generatedQuestions" :key="index" 
                :class="['question-card', { 'selected': isSelectedQuestion[index] }]">
                <div class="question-number">질문 {{ index + 1 }}</div>
                <div class="question-content">{{ question }}</div>
                <button 
                  @click="checkQuestion(index)"
                  class="star-button"
                  :class="{ 'selected': isSelectedQuestion[index] }"
                >
                  <v-icon>{{ isSelectedQuestion[index] ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
                </button>
              </div>
            </div>
            <button @click="saveQuestion" class="interview-end-button">
              <v-icon left>mdi-check-circle</v-icon>
              면접 종료
            </button>
          </div>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useInterviewStore } from '../stores/interviewStore';
import { useRouter } from 'vue-router';

const interviewStore = useInterviewStore()

const props = defineProps(['selectedCategory', 'generatedQuestions', 'categories'])

const emit = defineEmits(['update-category', 'change-category'])

const isDropdownOpen = ref(false);
const currentIndex = ref(0);
const newCategory = ref(props.selectedCategory);
const router = useRouter()

let isSelectedQuestion = ref([false, false, false, false, false])

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
}

const changeCategory = (category) => {
  // emit('update-category', category);
  emit('change-category', category);
  newCategory.value = category;
  isDropdownOpen.value = false;
}

const nextQuestion = () => {
  if (currentIndex.value < props.generatedQuestions.length) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const updateCategory = () => {
  emit('update-category', newCategory.value)
  isSelectedQuestion.value = [false, false, false, false, false]
  currentIndex.value = 0
}

const checkQuestion = (index) => {
  isSelectedQuestion.value[index] = !isSelectedQuestion.value[index]
}

const saveQuestion = async () => {
  const titleList: string[] = []
  for (let i = 0; i < 5; i++) {
    if (isSelectedQuestion.value[i]) {
      titleList.push(props.generatedQuestions[i])
    }
  }
  const categoryIndex: number = props.selectedCategory.id
  const res = await interviewStore.requestSaveQuestionListToSpring(titleList, categoryIndex)
  
  const idList: number[] = []
  for (let i = 0; i < res.length; i++) {
    idList.push(res[i].questionId)
  }
  const fastapiRes = await interviewStore.requestSaveQuestionListToChromaViaSpring(idList, categoryIndex, titleList)

  if (titleList.length > 0 && confirm("저장한 질문을 확인하시겠습니까?")) {
    router.push("/library")
  } else {
    router.push("/")
  }
}
</script>

<style scoped>
.questions-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100%;
  position: relative;
}

.category-header {
  position: fixed;
  margin-top: -65px;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #121212;
  padding: 1rem;
  border-bottom: 1px solid #2a2a2a;
}

.selected-category {
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
}

.dropdown-button {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-button:hover {
  background-color: #3a3a3a;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #2a2a2a;
  border-radius: 0.75rem;
  margin-top: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 101;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #3a3a3a;
}

.dropdown-item.active {
  background-color: #2563eb;
}

.main-content {
  display: flex;
  margin-top: 6rem;
  position: relative;
  min-height: calc(100% - 8rem);
  width: 100%;
}

.nav-container {
  position: fixed;
  top: 55%;
  transform: translateY(-50%);
  z-index: 90;
}

.nav-container.left {
  left: 2rem;
}

.nav-container.right {
  right: 2rem;
}

.nav-button {
  padding: 1rem 1.5rem;
  background-color: #2a2a2a;
  border: 1px solid #404040;
  border-radius: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover:not(:disabled) {
  background-color: #2563eb;
  transform: scale(1.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.question-section {
  flex: 1;
  margin: 0 8rem;
}

/* Single Question Styles */
.single-question {
  margin-right: -200px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  width: 100%;
  position: relative;
}

.single-question .question-card {
  background-color: #121212;
  border-radius: 1.5rem;
  padding: 3rem;
  width: 100%;
  max-width: 1000px;
  min-width: 800px;
  text-align: center;
  min-height: 40vh;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.single-question .question-number {
  font-size: 1.2rem;
  color: #9ca3af;
  margin-bottom: 2rem;
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.single-question .question-content {
  font-size: 2rem;
  color: white;
  margin-bottom: 3rem;
  line-height: 1.6;
  word-break: keep-all;
  position: relative;
  top: 60px;
  left: 0;
}

.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: #3a3a3a;
  color: white;
  border: none;
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.favorite-button:hover {
  scale: 1.05
}

.favorite-button.selected {
  background-color: #2563eb;
}

/* Final Page Styles */
.final-question-page {
  padding: 2rem;
  width: 100%;
}

.final-page-title {
  text-align: center;
  color: white;
  font-size: 1.8rem;
  margin-bottom: 3rem;
}

.questions-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
}

.question-card {
  background-color: #2a2a2a;
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  word-break: keep-all;
}

.question-card.selected {
  border-color: #2563eb;
  background-color: #1a1a1a;
}

.question-number {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.question-content {
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: center;
}

.star-button {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
}

.star-button:hover {
  transform: scale(1.2);
}

.star-button.selected {
  color: #2563eb;
}

.interview-end-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem auto;
  padding: 1rem 2rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.interview-end-button:hover {
  transform: scale(1.05);
  background-color: #1d4ed8;
}

.refresh-button {
  margin-left: 1rem;
  background-color: #2a2a2a !important;
  min-width: 48px !important;
}

.refresh-button:hover {
  background-color: #2563eb !important;
}

.dropdown-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}
</style>