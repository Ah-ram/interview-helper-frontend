<template>
    <v-container>
        <h2>Interview-helper 게시물 읽기</h2>
        <v-card>
            <v-card-title>게시물 정보</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <div><strong>제목:</strong> {{ title }}</div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <div><strong>작성자:</strong> {{ writer }}</div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <div><strong>내용:</strong> {{ content }}</div>
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
                            <v-btn color="secondary" @click="goToBoardListpage">돌아가기</v-btn>
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

const id = ref(route.params.boardId)

const title = ref("");
const writer = ref("");
const content = ref("");

async function getBoardData() {
    if (!id.value) {
        console.error("유효하지 않은 게시물 ID입니다! id:", id)
        router.push("/board/list")
        return;
    }

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
