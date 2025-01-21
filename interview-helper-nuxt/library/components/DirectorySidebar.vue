<template>
    <div class="sidebar">
        <v-icon class="close-button" @click="closeSidebar">mdi-close</v-icon>
        <div class="categories">
            <h2>Categories</h2>
            <ul>
                <div v-for="(category, index) in categories" :key="index" @click="selectCategory(index)" class="category">
                    <v-btn elevation="0" :class="['category-button', { active: selectedCategory === index }]">{{ category }}   
                    </v-btn>
                </div>
            </ul>
        </div>

        <div class="directory-information">
            <h2>Information</h2>
            <div class="directory-information-content">
                <p>폴더명: {{ selectedDirectory.name }}</p>
                <p>생성일: {{ selectedDirectory.createDate }}</p>
                <p>수정일: {{ selectedDirectory.updateDate }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(["selectedDirectory", "selectedCategory"])
const emit = defineEmits(["close-sidebar", "select-category"])

const categories = ref(["🎨 기술 역량", "👁️ 프로젝트 경험", "📝 문제 해결", "💡 커뮤니케이션", "💭 자기 소개 및 동기"])

const closeSidebar = () => {
    emit("close-sidebar", false)
}

const selectCategory = (value) => {
    emit("select-category", value)
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    width: 300px;
    border-left: 1px solid #666;
    padding-left: 20px;
    flex-shrink: 0;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.close-button {
    position: absolute;
    margin-top: 30px;
    right: 20px;
    /* background: red; */
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    z-index: 1;
}

.close-button:hover {
    scale: 1.1;
    background: #666;
    opacity: 0.8;
}

.categories {
    margin-top: 80px;
}

.categories h2 {
    color: #fff;
    margin-bottom: 20px;
}

.categories ul {
    list-style: none;
    padding: 0;    
}

.categories li {
    margin: 10px 0;
    font-size: 16px;
}

.category {
    width: 300px;
    /* padding-left: -10px; */
    /* margin-bottom: 17px; */
}

.category-button {
    border: none;
    border-radius: 8px;
    background-color: #121212;
    color: #fff;
    width: 282px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 16px;
    height: 60px;
    margin-left: -12px;
    padding-left: 30px;
}

.category-button.active {
    background-color: #2563eb;
}

.directory-information {
    color: #fff;
    padding-top: 30px;
    border-top: 1px solid #666;
    margin-top: 15vh;
    width: 282px;
    margin-left: -12px;
}

.directory-information h2{
    margin: 0 0 30px 12px;
}

.directory-information-content p {
    padding-left: 20px;
    margin: 15px 0;
}
</style>