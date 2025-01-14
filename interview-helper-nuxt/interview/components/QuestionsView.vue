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
        <div class="question-section">
          <button
            class="nav-button prev"
            @click="prevQuestion"
            :disabled="currentIndex === 0"
          >
            <
          </button>
          <div class="questions-container">
              <div v-if="generatedQuestions.length > 0" class="question-card">
                  <h3>질문 {{ currentIndex + 1 }}</h3>
                  <h1>{{ generatedQuestions[currentIndex] }}</h1>
              </div>
          </div>
          <button
            class="nav-button next"
            @click="nextQuestion"
            :disabled="currentIndex === generatedQuestions.length - 1"
          >
            >
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
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['selectedCategory', 'generatedQuestions', 'categories'])

const emit = defineEmits(['update-category', 'change-category'])

const isDropdownOpen = ref(false);
const currentIndex = ref(0);
const newCategory = ref(null);

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
  if (currentIndex.value < props.generatedQuestions.length - 1) {
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
}
</script>

<style scoped> 
.questions-view {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .category-header {
    /* position: sticky;
    top: 0;
    background-color: #121212;
    padding: 1rem 0; */
    margin-bottom: 3rem;
    /* z-index: 10; */
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
    border: 1px solid #404040;
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

  .question-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .nav-button {
    padding: 0.75rem 1.5rem;
    background-color: #2a2a2a;
    border: 1px solid #404040;
    border-radius: 0.75rem;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .nav-button:hover:not(:disabled) {
    background-color: #3a3a3a;
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .questions-container {
    flex: 1;
    min-height: 200px;
  }
  
  .question-card {
    background-color: #2a2a2a;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;

  }
  
  .question-card h3 {
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #9ca3af;
  }

  .question-card h1 {
    font-size: 1.8rem;
    color: white;
    margin-bottom: 20px;
  }

.refresh-button {
  background-color: #3a3a3a;
  color: white;
  align-items: center;
  margin: 8px;
}

.refresh-button:hover {
  background-color: #2563eb;
}
</style>