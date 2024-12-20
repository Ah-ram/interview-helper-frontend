<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-text-field v-model="postData.title" label="제목"/>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-text-field v-model="postData.writer" label="작성자"/>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-text-field v-model="postData.content" label="내용" auto-grow/>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-right">
                <v-btn class="ml-2" color="primary" @click="onSubmit">작성 완료</v-btn>
                <v-btn class="ml-1" color="error" @click="onCancel">취소</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useBoardStore } from '../stores/boardStore';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const router = useRouter();
        const boardStore = useBoardStore();

        const postData = ref({
            title: '',
            writer: '',
            content: ''
        });

        const onSubmit = async() => {
            try {
                console.log('작성 완료 버튼 누름')

                const board = await boardStore.requestBoardCreateToSpring(postData.value);
                router.push({ name: 'board-list' })
            } catch (error) {
                console.error('게시글 작성 중 오류 발생:', error)
            }
        };

        const onCancel = async() => {
            console.log('취소 버튼 누름')
            router.back()
        };

        return {
            postData,
            onSubmit,
            onCancel,
        };
    }
});


</script>


