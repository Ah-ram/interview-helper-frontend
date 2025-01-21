<template>
    <div class="library-container">
      <!-- 상단 네비게이션 바 -->
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
  
      <!-- 질문 목록 -->
      <div class="questions-grid">
        <div v-for="question in savedQuestionList" 
             :key="question.id" 
             class="question-card">
          <div class="question-header">
            <h3 class="question-title">{{ question.title }}</h3>
            <button class="delete-btn" @click="deleteQuestion(question.id)">
              삭제
            </button>
          </div>
        </div>
    </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '../stores/LibraryStore'

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
const categories = ref(["🎨 기술 역량", "👁️ 프로젝트 경험", "📝 문제 해결", "💡 커뮤니케이션", "💭 자기 소개 및 동기"])

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
</script>
  
  <style scoped>
  .library-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .questions-grid {
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
  
  .audio-controls {
    margin: 1rem 0;
  }
  
  .audio-progress {
    height: 4px;
    background: #eee;
    border-radius: 2px;
    margin-top: 0.5rem;
  }
  
  .progress-bar {
    height: 100%;
    background: #007bff;
    border-radius: 2px;
  }
  
  .memo-section {
    margin-top: 1rem;
  }
  
  .memo-content {
    margin-top: 0.5rem;
  }
  
  .memo-content textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
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
  
  .memo-toggle {
    background: #6c757d;
  }
  
  .play-btn.playing {
    background: #28a745;
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
  
  .play-btn {
    width: 80px;
    margin-right: 1rem;
  }
  
  .memo-toggle {
    width: 100%;
    margin-top: 1rem;
    background: #6c757d;
  }
  
  .memo-content textarea {
    margin-top: 0.5rem;
    padding: 0.8rem;
    font-size: 0.9rem;
    resize: vertical;
  }
  
  .search-box input {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
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
  