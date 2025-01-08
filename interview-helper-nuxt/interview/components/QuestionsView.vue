<template>
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

<script setup>
import { ref } from 'vue';

defineProps(['selectedCategory', 'generatedQuestions', 'categories'])

const emit = defineEmits(['update-category'])

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
}

const changeCategory = (category) => {
    emit('update-category', category);
    isDropdownOpen.value = false;
}
</script>

<style>
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
</style>