<template>
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
        <div v-if="isSidebarVisible">
            <LibraryDirectorySidebar 
            :selected-directory="selectedDirectory"
            @closeSidebar="closeSidebar"
            @selectCategory="selectCategory"
            />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useLibraryStore } from '../stores/LibraryStore';
import Directory from '../components/Directory.vue';
import LibraryDirectorySidebar from '../components/DirectorySidebar.vue';

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
//   router.push(`/folders/${directoryId}`)
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

const deleteDirectory = async (directoryId: number) => {
//   try {
//     const { springAxiosInst } = createAxiosInstances()
//     const userToken = localStorage.getItem('userToken')
    
//     await springAxiosInst.post('/library/delete-directory', {
//       userToken: userToken,
//       directoryId: directoryId
//     })
    
//     // 폴더 목록 새로고침
//     await libraryStore.requestListDirectoryToSpring()
//   } catch (error) {
//     console.error('폴더 삭제 실패:', error)
//   }

    if (directoryId.toString().startsWith('temp-')) {
        tempDirectory.value = null
        return
    }
}

const closeSidebar = () => {
    isSidebarVisible.value = false;
}

const selectCategory = (value) => {
    selectedCategory.value = value
    console.log("selectedCategory:", value)
}

</script>
  
<style scoped>
.library-container {
    padding: 50px;
    background-color: #fff;
}

.directory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 50px;
    padding: 20px;
}

.add-directory-container {
    display: flex;
    justify-content: center;
    align-items: start;
    margin: 15px;
}

.add-directory-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;
    width: 200px;
}

.add-directory-button:hover {
    transform: scale(1.05);
}

.new-directory {
    width: 120px;
    height: 96px;
    position: relative;
    margin-bottom: 8px;
    display: flex;
}

.new-directory::before {
    content: '';
    width: 50%;
    height: 25px;
    position: absolute;
    top: -12px;
    left: 0;
    background: linear-gradient(180deg, #E0E0E0 0%, #CCCCCC 100%);
    border-radius: 8px 15px 0 0;
    clip-path: polygon(
         0 0,
          70% 0,
          100% 70%,
          100% 100%,
          0 100%
    );
}

.new-directory::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background: linear-gradient(180deg, #E0E0E0 0%, #CCCCCC 100%);
    border-radius: 8px;
    /* box-shadow: 
        inset 0 -2px 5px rgba(0,0,0,0.1),
        0 5px 15px rgba(0,0,0,0.1); */
}

.directory-front {
    width: 100%;
    height: 90%;
    position: absolute;
    bottom: 0;
    background: linear-gradient(180deg, #F0F0F0 0%, #E0E0E0 100%);
    border-radius: 8px;
    z-index: 2;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.new-directory .material-icons {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #666;
    z-index: 3;
}
.button-text {
    font-size: 12px;
    color: #333;
    text-align: center;
}

.new-directory-dialog {
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
}

.directory-name-input {
    width: 100%;
    padding: 8px;
    border: 2px solid #3693F4;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    outline: none;
    transition: border-color 0.2s;
}

.directory-name-input:focus {
    border-color: #2D7AD4;
    box-shadow: 0 0 0 2px rgba(54, 147, 244, 0.3);
}
</style>