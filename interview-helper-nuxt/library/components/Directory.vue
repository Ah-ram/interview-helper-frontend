<template>
    <div class="directory-container" :class="{ selected: isSelected }" @click="handleDirectoryClick">
        <div class="directory-icon">
            <div class="directory-content">
                <div class="edit-overlay">
                <input
                v-if="isEditing || isTemp" 
                v-model="directoryName"
                @blur="handleBlur"
                @keyup.enter="handleEnter"
                ref="nameInput"
                class="directory-name-input"
                :placeholder="isTemp ? '새폴더' : ''"
                />
                <span v-else class="directory-name">{{ directoryName }}</span>
            </div>
        </div>
    </div>                
    <div class="directory-actions" v-if="!isTemp">
        <button @click.stop="startEditing" class="action-button">
            <v-icon class="material-icons">mdi-pencil-outline</v-icon>
        </button>
        <button @click.stop="handleDelete" class="action-button">
            <v-icon class="material-icons">mdi-trash-can-outline</v-icon>
        </button>
        </div>
    </div>        
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLibraryStore } from '../stores/LibraryStore';

const libraryStore = useLibraryStore()
const router = useRouter()

interface DirectoryProps {
    id: number
    name: string
    createDate: string
    updateDate: string
    isTemp?: boolean
    isSelected?: boolean
}

const props = defineProps<DirectoryProps>()

const emit = defineEmits<{
    directorySelected: [DirectoryProps]
    createDirectory: [{ id: number | string, name: string }]
    updateName: [{ id: number, name: string }]
    deleteDirectory: [id: number]
}>()

const directoryName = ref(props.name)
const isEditing = ref(false)
// const nameInput = ref<HTMLInputElement | null>(null)
const nameInput = ref(null as unknown as HTMLInputElement)
const isTemp = computed(() => props.isTemp || false)
const isSelected = computed(() => props.isSelected || false)

onMounted(() => {
    if (props.isTemp) {
        nextTick(() => {
            nameInput.value.focus()
        })
    }
})

const handleDirectoryClick = () => {
    if (!isTemp.value) {
        emit('directorySelected', props)
    }
}

const handleEnter = (event: KeyboardEvent) => {
    if (isTemp.value) {
        if (!directoryName.value.trim()) {
            directoryName.value = '새폴더'
        }
        emit('createDirectory', {
            id: props.id,
            name: directoryName.value.trim(),
            isEnterPressed: true
        })
    } else {
        if (props.name == 'default') {
            alert('default 폴더는 이름을 변경할 수 없습니다!')
            return
        }
        emit('updateName', {
            id: props.id,
            name: directoryName.value.trim(),
            isEnterPressed: false
        })
        isEditing.value = false
        // directoryName.value = nameInput.value.value
        event.target?.blur();
    }
}

const handleBlur = () => {
    if (isTemp.value) {
        emit('deleteDirectory', props.id)
    } else if (isEditing.value) {
        if (!directoryName.value.trim()) {
            // 이름 입력 안하면 원래 이름으로 복구
            directoryName.value = props.name
            isEditing.value = false
            return
        }
        isEditing.value = false
        directoryName.value = props.name
    }
}

const startEditing = () => {
    isEditing.value = true
    nextTick(() => {
        nameInput.value.focus()
    })
}

const handleDelete = () => {
    if (confirm('정말 이 폴더를 삭제하시겠습니까?')) {
        if (props.name == 'default') {
            alert('default 폴더는 삭제할 수 없습니다!')
            return 
        }
        emit('deleteDirectory', props.id)
    }
}

</script>
  
<style scoped>
.directory-container {
    width: 100px;
    margin: 15px;
    cursor: pointer;
    transition: transform 0.2s;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.directory-container:hover {
    transform: scale(1.05);
}

.directory-container:hover .directory-actions {
    opacity: 1;
}

.directory-container.selected .directory-icon::before {
    background: linear-gradient(180deg, #2D7AD4 0%, #1A5CAF 100%);
}

.directory-container.selected .directory-icon::after {
    background: linear-gradient(180deg, #2D7AD4 0%, #1A5CAF 100%);
    box-shadow: 
        inset 0 -2px 5px rgba(0,0,0,0.2),
        0 5px 15px rgba(0,0,0,0.2);
}

.directory-container.selected .directory-content {
    background: linear-gradient(180deg, #3693F4 0%, #2563f4 100%);
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.directory-icon {
    width: 120px;
    height: 96px;
    position: relative;
    margin-bottom: 8px;
    display: flex;
}

.directory-icon::before {
    content: '';
    width: 50%;
    height: 25px;
    position: absolute;
    top: -12px;
    left: 0;
    background: linear-gradient(180deg, #3693F4 0%, #2D7AD4 100%);
    border-radius: 8px 15px 0 0;
    clip-path: polygon(
         0 0,
          70% 0,
          100% 70%,
          100% 100%,
          0 100%
    );
}

.directory-icon::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background: linear-gradient(180deg, #3693F4 0%, #2D7AD4 100%);
    border-radius: 8px;
    box-shadow: 
        inset 0 -2px 5px rgba(0,0,0,0.1),
        0 5px 15px rgba(0,0,0,0.1);
}

.directory-content {
    width: 100%;
    height: 90%;
    position: absolute;
    bottom: 0;
    background: linear-gradient(180deg, #5BA7F3 0%, #3693F4 100%);
    border-radius: 8px;
    z-index: 2;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.directory-name {
    color: #fff;
    font-size: 12px;
    text-align: center;
    margin-top: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
    padding: 2px 4px;
    width: 100%;
}

.edit-overlay {
    position: absolute;
    bottom: -30px;
    left: 0;
    width: 100%;
    z-index: 2;
}

.directory-name-input {
    width: 100%;
    padding: 2px 4px;
    font-size: 12px;
    border: 1px solid #3693F4;
    border-radius: 4px;
    text-align: center;
    color: #aaa;
}

.directory-name-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(54, 147, 244, 0.3);
}

.directory-actions {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.2s;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    padding: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    z-index: 3;
}

.action-button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
}

.action-button:hover {
    opacity: 1;
}

.action-button .material-icons {
    font-size: 16px;
    color: #666;
}

.action-button:hover .material-icons {
    color: #3693F4;
}

.update-date {
    font-size: 10px;
    color: #666;
    text-align: center;
    margin-top: 2px;
}

</style>