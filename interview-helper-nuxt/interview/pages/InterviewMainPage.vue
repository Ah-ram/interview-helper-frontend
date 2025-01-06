<template>
    <div class="container">
      <!-- 초기 카테고리 선택 화면 -->
      <template v-if="showQuestions == null">
        <InterviewCategory @click-question="generateQuestions" />
      </template>
  
      <!-- 질문 생성 후 화면 -->
      <template v-else>
        <div class="questions-view">
          <div class="category-header">
            <div class="selected-category">
              <button @click="toggleDropdown" class="dropdown-button">
                <span class="category-icon">{{ selectedCategory.icon }}</span>
                <span class="category-label">{{ selectedCategory.label }}</span>
                <span class="dropdown-arrow" :class="{ 'open': isDropdownOpen }">▼</span>
              </button>
  
              <div v-if="isDropdownOpen" class="dropdown-menu">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="changeCategory(category)"
                  :class="['dropdown-item', { active: selectedCategory?.id === category.id }]"
                >
                  <span class="category-icon">{{ category.icon }}</span>
                  <span class="category-label">{{ category.label }}</span>
                </button>
              </div>
            </div>
          </div>
  
          <div class="questions-container">
            <div v-for="(question, index) in generatedQuestions" :key="index" class="question-card">
              <h3>질문 {{ index + 1 }}</h3>
              <p>{{ question }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import InterviewCategory from '../components/InterviewCategory.vue';
  
 
  const showQuestions = ref(null);
  const isDropdownOpen = ref(false);
  const generatedQuestions = ref([]);
  const selectedCategory = ref(null);
  
  const categories = [
    { id: 'technical', label: '기술 역량', icon: '🎨' },
    { id: 'project', label: '프로젝트 경험', icon: '👁️' },
    { id: 'problem-solving', label: '문제 해결', icon: '📝' },
    { id: 'communication', label: '커뮤니케이션', icon: '💡' },
    { id: 'introduction', label: '자기 소개 및 동기', icon: '💭' },
  ];

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };
  
  const changeCategory = (category) => {
    selectedCategory.value = category;
    isDropdownOpen.value = false;
    generateQuestions(category);
  };
  
  const generateQuestions = (value) => {
    // 실제 구현에서는 API 호출 등을 통해 질문을 생성하면 됩니다
    generatedQuestions.value = [
      '이것은 생성된 첫 번째 질문입니다.',
      '이것은 생성된 두 번째 질문입니다.',
      '이것은 생성된 세 번째 질문입니다.'
    ];
    console.log("Value:", value)
    showQuestions.value = value;
    selectedCategory.value = value;
    isDropdownOpen.value = false;
  };
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    background-color: #1a1a1a;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .category-icon {
    font-size: 1.25rem;
  }

  .category-label {
      font-size: 0.875rem;
      white-space: nowrap;
  }
  
  /* 질문 생성 후 추가되는 스타일 */
  .questions-view {
    width: 100%;
    max-width: 800px;
  }
  
  .category-header {
    position: sticky;
    top: 0;
    background-color: #1a1a1a;
    padding: 1rem 0;
    margin-bottom: 2rem;
    z-index: 10;
  }
  
  .selected-category {
    position: relative;
    width: 100%;
    max-width: 300px;
  }
  
  .dropdown-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #2a2a2a;
    border: none;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    color: white;
    cursor: pointer;
  }
  
  .dropdown-arrow {
    margin-left: auto;
    transition: transform 0.2s ease;
  }
  
  .dropdown-arrow.open {
    transform: rotate(180deg);
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
  }
  
  .dropdown-item:hover {
    background-color: #3a3a3a;
  }
  
  .dropdown-item.active {
    background-color: #2563eb;
  }
  
  .questions-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .question-card {
    background-color: #2a2a2a;
    border-radius: 0.75rem;
    padding: 1rem;
    color: white;
  }
  
  .question-card h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #9ca3af;
  }
  
  @media (max-width: 768px) {
    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .container {
      padding: 1rem;
    }
  }
  </style>