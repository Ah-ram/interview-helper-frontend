<template>
    <div class="sidebar">
        <v-icon class="close-button" @click="closeSidebar">mdi-close</v-icon>
        <div class="categories">
            <h2>Categories</h2>
            <ul>
                <div v-for="(category, index) in categories" :key="index" @click="selectCategory(index)" class="category">
                    <v-btn elevation="0" :class="['category-button', { active: selectedCategory === index }]">
                        <span class="category-text">{{ category }}</span>   
                    </v-btn>
                </div>
            </ul>
        </div>

        <div class="directory-information">
            <h2>Information</h2>
            <div class="directory-information-content">
                <p><span>폴더명: </span>{{ selectedDirectory.name }}</p>
                <p><span>생성일: </span>{{ selectedDirectory.createDate }}</p>
                <p><span>수정일: </span>{{ selectedDirectory.updateDate }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(["selectedDirectory", "selectedCategory"])
const emit = defineEmits(["close-sidebar", "select-category"])

const categories = ref(["🎨 기술 역량", "🧑‍💻 프로젝트 경험", "📝 문제 해결", "🗣️ 커뮤니케이션", "💭 자기 소개 및 동기"])

const closeSidebar = () => {
    emit("close-sidebar", false)
}

const selectCategory = (value) => {
    emit("select-category", value)
}
</script>

<style scoped>
.sidebar {
    position: sticky;
    width: 320px;
    background: linear-gradient(135deg, #1e1e2e, #1a1a1a);
    border-left: 2px solid rgba(255, 255, 255, 0.1);;
    padding: 30px 20px;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.close-button {
    position: absolute;
    top: 30px;
    right: 20px;
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
}

.categories {
    margin-top: 60px;
}

.categories h2 {
    color: #4a90e2;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #4a90e2;
}

.categories ul {
    list-style: none;
    padding: 0;    
}

.category {
    margin-bottom: 15px;
}

.category-button {
    width: 100%;
    height: 60px;
    justify-content: flex-start !important;
    background-color: transparent;
    border: 2px solid transparent;
    border-radius: 8px;
    color: #e0e0e0;
    font-size: 18px;
    padding: 15px 20px;
    transition: all 0.3s ease;
}

/* .category-text {
    text-align: left;
    width: 100%;
    display: inline-block;
    font-size: 18px;
} */

.category-button:hover {
    background-color: rgba(37, 99, 235, 0.2);
    border-color: #2563eb;
    color: #fff;
}

.category-button.active {
    background-color: #2563eb;
    color: #fff;
    border-color: #2563eb;
}

.directory-information {
    /* border-top: 2px solid #4a4a6a; */
    padding-top: 30px;
    margin-top: 5vh;
}

.directory-information h2 {
    color: #4a90e2;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #4a90e2;
}

.directory-information-content p {
    color: #e0e0e0;
    margin: 15px;
    display: flex;
    align-items: center;
}

.directory-information-content p span {
    color: #3693f4;
    margin-right: 10px;
    min-width: 80px;
    display: inline-block;
    font-weight: bold;
}

</style>