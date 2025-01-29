<template>
    <div class="sidebar">
        <v-icon class="close-button" @click="closeSidebar">mdi-close</v-icon>
        <div class="directories">
            <h2>Directories</h2>
            <ul>
                <div v-for="(directory, index) in directories" 
                     :key="index" 
                     @click="selectDirectory(directory.id)" 
                     class="directory">
                    <v-btn elevation="0" class="directory-button">
                        {{ directory.name }}
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
    console.log("selectDirectory:", value, props.selectedQuestion)
    const response = await libraryStore.requestMoveQuestionToSpring(value, props.selectedQuestion)
    console.log("isMoved:", response)
    emit("select-directory", value)
}
</script>

<style scoped>
.sidebar {
    position: fixed;
    background-color: hotpink;
    width: 100%;
    height: 100vh;
    border-left: 1px solid #666;
    padding: clamp(10px, 3vw, 20px);
    flex-shrink: 0;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
}

@media (min-width: 768px) {
    .sidebar {
        width: 100%;
        position: relative;
        height: 100%;
    }
}

.close-button {
    position: absolute;
    top: clamp(15px, 4vw, 30px);
    right: clamp(10px, 3vw, 20px);
    color: white;
    border: none;
    border-radius: 50%;
    width: clamp(24px, 5vw, 30px);
    height: clamp(24px, 5vw, 30px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    z-index: 1;
}

.close-button:hover {
    transform: scale(1.1);
    background: #666;
    opacity: 0.8;
}

.directories {
    margin-top: clamp(40px, 8vw, 80px);
}

.directories h2 {
    color: #fff;
    margin-bottom: clamp(15px, 4vw, 20px);
    font-size: clamp(18px, 4vw, 24px);
}

.directory {
    width: 100%;
    margin-bottom: clamp(8px, 2vw, 15px);
}

.directory-button {
    border: none;
    border-radius: 8px;
    background-color: #121212;
    color: #fff;
    width: 100%;
    max-width: 282px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: clamp(14px, 3vw, 16px);
    height: clamp(48px, 10vw, 60px);
    padding-left: clamp(15px, 4vw, 30px);
}

.directory-button:hover {
    background-color: #2563eb;
}

.directory-information {
    color: #fff;
    padding-top: clamp(20px, 5vw, 30px);
    border-top: 1px solid #666;
    margin-top: 15vh;
    width: 100%;
    max-width: 282px;
}

.directory-information h2 {
    margin: 0 0 clamp(20px, 5vw, 30px) clamp(8px, 2vw, 12px);
}

.directory-information-content p {
    padding-left: clamp(15px, 4vw, 30px);
    margin: clamp(10px, 3vw, 15px) 0;
    font-weight: bold;
    font-size: clamp(14px, 3vw, 16px);
}
</style>
