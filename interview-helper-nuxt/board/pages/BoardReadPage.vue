<template>
    <v-container>
        <h2>Vue3 + Vuetify3 + TypeScript 게시물 읽기!</h2>
        <v-card>
            <v-card-title>게시물 정보</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field readonly label="제목">{{ title }}</v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field readonly label="작성자">{{ writer }}</v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field readonly label="내용" auto-grow>{{ content }}</v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="end">
                        <v-col cols="auto">
                            <v-btn color="primary">수정</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn color="error">삭제</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn color="secondary" @click="goToBoardListpage()">돌아가기</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBoardStore } from '../stores/boardStore';
import { useRouter, useRoute } from '#imports';

const boardStore = useBoardStore();
const route = useRoute();
const router = useRouter();

console.log("route.params:", route.params)
const id = ref(route.params.boardId)

const title = ref("");
const writer = ref("");
const content = ref("");

async function getBoardData() {
    console.log("readPage boardId:", id);
    try {
        const res = await boardStore.requestBoardToSpring(id.value);
        title.value = res.title;
        writer.value = res.writer;
        content.value = res.content;
    } catch (error) {
        console.error("requestBoardToSpring() 중 에러 발생:", error);
        throw error
    }
}

function goToBoardListpage() {
    router.push("/board/list")
}

onMounted(async () => {
    await getBoardData();
})

</script>
