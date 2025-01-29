<template>
    <div v-if="!isQuestionListVisible" class="wrapper">
      <div class="library-container">
        <div class="directory-grid">
          <Directory
            v-for="directory in allDirectories"
            :key="directory.id"
            :id="directory.id"
            :name="directory.name"
            :create-date="directory.createDate"
            :update-date="directory.updateDate"
            :is-temp="directory.isTemp"
            :is-selected="selectedDirectory && selectedDirectory.id === directory.id"
            @directorySelected="handleDirectorySelect"
            @createDirectory="createDirectory"
            @updateName="updateDirectoryName"
            @deleteDirectory="deleteDirectory"
          />
          <div class="add-directory-container">
            <button @click="addTempDirectory" class="add-directory-button">
              <div class="new-directory">
                <div class="directory-front"></div>
                <v-icon class="material-icons">mdi-plus</v-icon>
              </div>
              <span class="button-text">New Directory</span>
            </button>
          </div>
        </div>
      </div>
      <div v-if="isSidebarVisible" class="sidebar-container">
        <LibraryDirectorySidebar 
          :selected-directory="selectedDirectory"
          :selected-category="selectedCategory"
          @closeSidebar="closeSidebar"
          @selectCategory="selectCategory"
        />
      </div>
    </div>
    <div v-else>
      <QuestionList 
        :selected-directory="selectedDirectory"
        :selected-category="selectedCategory"
        @goToDirectory="goToDirectory"
        @updateCategory="updateCategoryFromQuestionList"
      />
    </div>
  </template>

<script setup lang="ts">
import { onMounted, computed, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useLibraryStore } from '../stores/LibraryStore';
import Directory from '../components/Directory.vue';
import LibraryDirectorySidebar from '../components/DirectorySidebar.vue';
import QuestionList from '../components/QuestionList.vue';

const libraryStore = useLibraryStore()
const router = useRouter()
const directoryName = ref('')
const tempDirectory = ref<null | {id: string, name: string, updateDate: string, isTemp: boolean}>(null)

const allDirectories = computed(() => {
    const directories = libraryStore.directories || []
    return tempDirectory.value ? [...directories, tempDirectory.value] : directories
})

const selectedDirectory = ref<null | {id: number, name: string, createDate: string, updateDate: string}>(null)
const isSidebarVisible = ref(false)
const selectedCategory = ref<null | number>(null)

const isQuestionListVisible = ref(false)

onMounted(async () => {
    await libraryStore.requestListDirectoryToSpring()
})

const addTempDirectory = () => {
    tempDirectory.value = {
        id: 'temp-' + Date.now(),
        name: '',
        updateDate: new Date().toISOString(),
        isTemp: true
    }
}

const handleDirectorySelect = (directory) => {
    selectedDirectory.value = directory
    isSidebarVisible.value = true
}

const createDirectory = async (directory) => {
    if (directory.id.toString().startsWith('temp-')) {
       try {
            const isDuplicate = await libraryStore.requestCheckDirectoryNameDuplicateToSpring(directory.name.trim())
            console.log('isDulplicate:', isDuplicate)
            tempDirectory.value = null
            await libraryStore.requestCreateDirectoryToSpring(isDuplicate)
            await libraryStore.requestListDirectoryToSpring()
        } catch (error) {
            console.error('새 디렉토리 생성 중 오류 발생:', error)
        }   
    } 
}

const updateDirectoryName = async (directory) => {
    try {
        // 현재 이름과 동일한 경우 무시
        const originalDirectory = libraryStore.directories.find(dir => dir.id === directory.id)
        if (originalDirectory && originalDirectory.name === directory.name.trim()) {
            return
        }

        // 다른 디렉토리와 이름 중복체크
        const existingDirectory = libraryStore.directories.find(dir => dir.id !== directory.id && dir.name === directory.name.trim())
        if (existingDirectory) {
            alert('이미 존재하는 폴더 이름입니다.')
            // 원래 이름으로 복구
            if (originalDirectory) {
                directory.name = originalDirectory.name
            }
            return
        }

        await libraryStore.requestChangeDirectoryNameToSpring(directory.id, directory.name.trim())    
        await libraryStore.requestListDirectoryToSpring()

        const updatedDirectory = libraryStore.directories.find(dir => dir.id === directory.id)
        if (updatedDirectory) {
            directory.name = updatedDirectory.name
        }
    } catch (error) {
        console.error('디렉토리 이름 변경 중 오류 발생:', error)
    }      
}

const deleteDirectory = async (directoryId) => {
    if (directoryId.toString().startsWith('temp-')) {
        tempDirectory.value = null
        return
    }
    try {
        await libraryStore.requestDeleteDirectoryToSpring(directoryId)
        await libraryStore.requestListDirectoryToSpring()
    } catch (error) {
        console.error('디렉토리 삭제 중 에러 에러 발생:', error)
    }
}

const closeSidebar = () => {
    isSidebarVisible.value = false;
}

const selectCategory = async (value) => {
    selectedCategory.value = value
    isSidebarVisible.value = false
    isQuestionListVisible.value = true
}

const goToDirectory = (value) => {
    isQuestionListVisible.value = value
    isSidebarVisible.value = true
}

const updateCategoryFromQuestionList = (value) => {
    selectedCategory.value = value
}
</script>
  
  <style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 768px) {
    .wrapper {
      flex-direction: row;
    }
  }
  
  .library-container {
    padding: clamp(20px, 5vw, 50px);
    background-color: #121212;
    width: 100%;
  }
  
  @media (min-width: 768px) {
    .library-container {
      width: calc(100% - 300px);
    }
  }
  
  .directory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
    gap: clamp(20px, 3vw, 50px);
    padding: clamp(10px, 2vw, 20px);
  }
  
  .add-directory-button {
    width: clamp(120px, 15vw, 200px);
  }
  
  .new-directory {
    width: clamp(80px, 12vw, 120px);
  }
  
  .button-text {
    font-size: clamp(10px, 1.5vw, 12px);
  }
  
  .sidebar-container {
    width: 100%;
    max-height: 300px;
  }
  
  @media (min-width: 768px) {
    .sidebar-container {
      width: 300px;
      max-height: none;
    }
  }
  </style>
  