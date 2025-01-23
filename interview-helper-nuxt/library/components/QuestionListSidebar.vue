<template>
    <div class="sidebar">
        <v-icon class="close-button" @click="closeSidebar">mdi-close</v-icon>
        <div class="directories">
            <h2>Directories</h2>
            <ul>
                <div v-for="(directory, index) in directories" :key="index" @click="selectDirectory(directory.id)" class="directory">
                    <v-btn elevation="0" class="directory-button">{{ directory.name }}
                    </v-btn>
                </div>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useLibraryStore } from '../stores/LibraryStore'

const props = defineProps(["selectedDirectory", "selectedCategory", "selectedQuestion"])
const emit = defineEmits(["close-sidebar", "select-directory"])
const libraryStore = useLibraryStore()
const directories = ref([])


const categories = ref(["🎨 기술 역량", "🧑‍💻 프로젝트 경험", "📝 문제 해결", "🗣️ 커뮤니케이션", "💭 자기 소개 및 동기"])

onMounted(async () => {
    await libraryStore.requestListDirectoryToSpring()
    directories.value = libraryStore.directories.filter(d => d.id !== props.selectedDirectory.id)
    console.log("directories:", directories.value)
})

const closeSidebar = () => {
    emit("close-sidebar", false)
}

const selectDirectory = async (value) => {
    const response = await libraryStore.requestMoveQuestionToSpring(value, props.selectedCategory, props.selectedQuestion)
    console.log("isMoved:", response)
    emit("select-directory", value)
}
</script>

<style scoped>
.sidebar {
    position: relative;
    background-color: hotpink;
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

.category-button:hover {
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
    padding-left: 30px;
    margin: 15px 0;
    font-weight: bold;
}

.directory-information-content p span {
    color: #3693f4;
}

</style>