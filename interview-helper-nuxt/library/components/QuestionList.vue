<template>
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
                    {{ category }}
                </option>
            </select>
            </div>
        </div>
    <div class="question-wrapper">
        <div class="library-container">
        <!-- 상단 네비게이션 바 -->
        
  
      <!-- 질문 목록 -->
      <div class="questions-grid">
        <div v-for="question in savedQuestionList" 
             :key="question.id" 
             class="question-card">
          <div class="question-header">
            <h3 class="question-title">{{ question.title }}</h3>
            <button @click="clickMoveQuestionButton(question.id)">
                디렉토리 이동
            </button>
            <button class="delete-btn" @click="deleteQuestion(question.id)">
              삭제
            </button>
          </div>
        </div>
    </div>
    <div v-if="isSidebarVisible">
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
  .library-container {
    /* max-width: 1200px; */
    position: relative;
    margin: 0 auto;
    /* padding: 2rem; */
    width: 100%;
    display: flex;
    overflow: hidden;
    -webkit-transition: all .5s ease-in-out;
    transition: all .5s ease-in-out;
  }
  
  .nav-bar {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 6rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
  
  .questions-grid {
    margin: 0 auto;
    display: grid;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .question-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }
  
  .pagination span {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
  
  .pagination span.active {
    background: #007bff;
    color: white;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #007bff;
    color: white;
    cursor: pointer;
  }
  
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .delete-btn {
    background: #dc3545;
  }

  .question-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
  
  .delete-btn {
    padding: 0.3rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .search-box input {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 500px;
  }
  
  .category-filter select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
  }
  
  .back-btn {
    background: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  </style>
  