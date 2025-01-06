<template>
    <h1 class="title">면접을 진행할 카테고리를 선택해주세요</h1>
    
    <div class="categories-grid">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
        :class="['category-button', { active: selectedCategory?.id === category.id }]"
      >
        <div class="category-icon">{{ category.icon }}</div>
        <span class="category-label">{{ category.label }}</span>
      </button>
    </div>

    <div v-if="selectedCategory" class="generate-button-wrapper">
      <button class="generate-button" @click="generateQuestions">질문 생성하기</button>
    </div>
  </template>

<script setup>
const emit = defineEmits(['click-question']);
const selectedCategory = ref(null);

const generateQuestions = () => {
    emit("click-question", selectedCategory.value);
}

const categories = [
    { id: 'technical', label: '기술 역량', icon: '🎨' },
    { id: 'project', label: '프로젝트 경험', icon: '👁️' },
    { id: 'problem-solving', label: '문제 해결', icon: '📝' },
    { id: 'communication', label: '커뮤니케이션', icon: '💡' },
    { id: 'introduction', label: '자기 소개 및 동기', icon: '💭' },
];

const selectCategory = (category) => {
    selectedCategory.value = category;
};

</script>

<style>
.title {
    margin-top: 100px;
    color: white;
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.75rem;
    max-width: 800px;
    width: 100%;
}

.category-button {
    background-color: #2a2a2a;
    border: none;
    border-radius: 0.75rem;
    padding: 0.75rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.category-button:hover {
    background-color: #3a3a3a;
}

.category-button.active {
    background-color: #2563eb;
}

.category-icon {
    font-size: 1.25rem;
}

.category-label {
    font-size: 0.875rem;
    white-space: nowrap;
}

.generate-button-wrapper {
    margin-top: 5rem;
    text-align: center;
}

.generate-button {
    background-color: #2563eb;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.generate-button:hover {
    background-color: #1d4ed8;
}
</style>