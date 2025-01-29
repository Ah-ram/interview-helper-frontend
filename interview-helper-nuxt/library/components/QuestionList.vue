<template>
  <div class="question-container">
    <div class="nav-bar">
      <button class="back-btn" @click="goToDirectory">
        <span>← 돌아가기</span>
      </button>
      <div class="search-box">
        <input type="text" placeholder="질문 검색..." v-model="searchQuery">
      </div>
      <div class="category-filter">
        <select v-model="selectedCategoryIndex" @change="updateCategory($event, selectedCategoryIndex)">
          <option v-for="(category, index) in categories" :key="index" :value="index">
            {{ category }}<span v-if="index === selectedCategoryIndex">▼</span>
          </option>
        </select>
      </div>
    </div>

    
  <div class="content-wrapper">
    <div class="questions-grid">
      <div v-for="question in savedQuestionList" 
           :key="question.id" 
           class="question-card">
        <div class="question-header">
          <h3 class="question-title">{{ question.title }}</h3>
          <div class="button-container">
            <button class="toggle-button" @click="toggleContent(question.id)">
              <v-icon>{{ expandedCards.includes(question.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </button>
            <div class="dropdown">
              <button class="action-button" @click="toggleDropdown(question.id)">
                <v-icon>mdi-dots-vertical</v-icon>
              </button>
              <div class="dropdown-content" v-if="activeDropdown === question.id">
                <button @click="clickMoveQuestionButton(question.id)">
                  디렉토리 이동
                </button>
                <button class="delete-btn" @click="deleteQuestion(question.id)">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="question-content" :class="{ 'expanded': expandedCards.includes(question.id) }">
          <!-- 확장된 내용이 들어갈 자리 -->
          <p>질문 상세 내용이 여기에 표시됩니다.</p>
        </div>
      </div>
    </div>

      <div v-if="isSidebarVisible" class="sidebar-wrapper">
        <QuestionListSidebar 
          :selected-directory="props.selectedDirectory"
          :selected-category="props.selectedCategory"
          :selected-question="selectedQuestion"
          @selectDirectory="refreshQuestionList"
          @closeSidebar="toggleSidebar"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '../stores/LibraryStore'
import QuestionListSidebar from './QuestionListSidebar.vue'

const currentPage = ref(1)
const searchQuery = ref('')
const selectedCategory = ref('')
const router = useRouter()
const savedQuestionList = ref([] as unknown as {id: number, title: string}[])

const libraryStore = useLibraryStore()
const props = defineProps(['selectedDirectory', 'selectedCategory'])
const emit = defineEmits(['go-to-directory', 'update-category'])
const defaultValue = props.selectedCategory
const selectedCategoryIndex = ref(defaultValue)
const categories = ref(["🎨 기술 역량", "🧑‍💻 프로젝트 경험", "📝 문제 해결", "🗣️ 커뮤니케이션", "💭 자기 소개 및 동기"])
const isSidebarVisible = ref(false)
const selectedQuestion = ref(null)

const activeDropdown = ref(null)
const expandedCards = ref([])

const toggleDropdown = (questionId) => {
  activeDropdown.value = activeDropdown.value === questionId ? null : questionId
}

const toggleContent = (questionId) => {
  const index = expandedCards.value.indexOf(questionId)
  if (index === -1) {
    expandedCards.value.push(questionId)
  } else {
    expandedCards.value.splice(index, 1)
  }
}

onMounted(async () => {
    savedQuestionList.value = await libraryStore.requestListQuestionToSpring(props.selectedDirectory.name, props.selectedCategory)
})

const deleteQuestion = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
        savedQuestionList.value = savedQuestionList.value.filter(q => q.id !== id)
    }
}

const goToDirectory = () => {
    emit("go-to-directory", false)
}

const updateCategory = async (obj, index) => {
    savedQuestionList.value = await libraryStore.requestListQuestionToSpring(props.selectedDirectory.name, index)
    emit("update-category", index)
}

const clickMoveQuestionButton = (id) => {
    isSidebarVisible.value = true
    selectedQuestion.value = id
}

const refreshQuestionList = async () => {
    savedQuestionList.value = await libraryStore.requestListQuestionToSpring(props.selectedDirectory.name, props.selectedCategory)
    isSidebarVisible.value = false
}

const toggleSidebar = () => {
    isSidebarVisible.value = false
    selectedQuestion.value = null
}
</script>

<style scoped>
.question-container {
  padding: clamp(10px, 3vw, 30px);
  width: 100%;
}

.content-wrapper {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  gap: clamp(2rem, 3vw, 2.5rem);
}

.nav-bar {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: clamp(1rem, 3vw, 2rem);
  padding: clamp(0.5rem, 2vw, 1rem);
  width: 100%
}

@media (min-width: 768px) {
  .nav-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.search-box {
  flex: 1;
  width: 100%;
  max-width: 1000px;
}

.search-box input {
  width: 100%;
  padding: clamp(0.5rem, 1vw, 0.8rem) clamp(1rem, 1.5vw, 1.5rem);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
}

.questions-grid {
  width: 100%;
  transition: width 0.3s ease;
}

@media (min-width: 768px) {
  .questions-grid {
    width: calc(100% - 25%);
  }
}

.question-card {
  background: white;
  border-radius: 8px;
  padding: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: clamp(1rem, 2vw, 2rem);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%;
}

.question-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem;
}

.question-title {
  flex: 0 0 80%;
  font-size: clamp(1rem, 1.5vw, 1.1rem);
  color: #2c3e50;
  margin: 0;
  padding-right: 1rem;
}

.button-container {
  flex: 0 0 20%;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dropdown {
  position: relative;
}

.action-button, .toggle-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover, .toggle-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

.dropdown-content {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  min-width: 120px;
  z-index: 1000;
}

.dropdown-content button {
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
}

.dropdown-content button:hover {
  background-color: #f5f5f5;
}

.question-content {
  max-height: 0;
  overflow: hidden;
  padding: 0 1rem;
}

.question-content.expanded {
  max-height: 500px;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.button-group {
  display: flex;
  gap: clamp(0.3rem, 1vw, 0.5rem);
}

.button-group button {
  padding: clamp(0.3rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 1rem);
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  white-space: nowrap;
}

.sidebar-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 25%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .sidebar-wrapper {
    position: relative;
    /* height: auto; */
    width: 25%;
    background-color: transparent;
  }
}

.nav-buttons {
  flex: 0 0 18%;
  display: flex;
  gap: clamp(0.5rem, 1vw, 1rem);
  justify-content: flex-end;
}

.back-btn, .category-filter select {
  padding: clamp(0.5rem, 1vw, 0.8rem);
  border-radius: 4px;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  min-width: clamp(80px, 10vw, 120px);
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  white-space: nowrap;
}

.category-filter select {
  border: 1px solid #ddd;
  background: white;
  min-width: 300px;
}

@media (max-width: 767px) {
  .search-box, .nav-buttons {
    flex: 0 0 100%;
  }
  
  .nav-buttons {
    justify-content: space-between;
  }
}
</style>
