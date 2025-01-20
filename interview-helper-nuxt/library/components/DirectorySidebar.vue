<template>
    <div class="sidebar">
        <button class="close-button" @click="closeSidebar">X</button>
        <div class="categories">
            <h2>Categories</h2>
            <ul>
                <li v-for="(category, index) in categories" :key="index" @click="selectCategory(index)">{{ category }}</li>
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

const props = defineProps(["selectedDirectory"])
const emit = defineEmits(["close-sidebar", "select-category"])

const categories = ref(["기술 역량", "프로젝트 경험", "문제 해결", "커뮤니케이션", "자기 소개 및 동기"])

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
    border-left: 1px solid #eee;
    padding-left: 20px;
    flex-shrink: 0;
    right: 0;
    top: 10;
    height: 85vh;
    display: flex;
    flex-direction: column;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 40px;
    background: red;
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

.categories {
    margin-bottom: 40px;
}

.categories ul {
    list-style: none;
    padding: 0;
}

.categories li {
    margin: 10px 0;
    font-size: 16px;
}

.directory-information {
    padding: 20px;
    border-top: 1px solid #eee;
    margin-top: auto;
}

.directory-information h2{
    margin-bottom: 20px;
}

.directory-information-content p {
    margin: 10px 0;
}
</style>