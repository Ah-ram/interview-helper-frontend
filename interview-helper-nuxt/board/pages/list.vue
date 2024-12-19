<template>
    <v-container>
        <h2 class="text-h4 mb-4">안녕, Vue3 + Vuetify3 + Nuxt3 + TypeScript 기반 Board App이야</h2>

        <!-- 게시물 작성 버튼 -->
        <div class="text-left mb-4">
            <v-btn color="primary" @click="createPost">
                게시물 작성
            </v-btn>
        </div>

        <!-- 데이터 테이블 -->
        <v-data-table
            v-model:items-per-page="perPage"
            :headers="headerTitle"
            :items="pagedItems"
            v-model:pagination="pagination"
            class="elevation-1"
            @click:row="readRow"
            item-value="boardId"
            :items-per-page-options="[5, 10, 15]"
        />

        <!-- 페이지네이션 -->
        <v-pagination
            v-model="pagination.page"
            :length="pageCount"
            color="primary"
            class="mt-4"
        />
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useBoardStore } from '../stores/boardStore';

export default defineComponent({
    setup() {
        const boardStore = useBoardStore(); // Pinia Store 사용

        const perPage = ref(5); // 페이지당 아이템 수
        const pagination = ref({ page: 1 }); // 페이지네이션

        const headerTitle = [
            { text: 'No', align: 'start', sortable: true, value: 'boardId' },
            { text: '제목', align: 'start', value: 'title' },
            { text: '작성자', align: 'start', value: 'writer' },
            { text: '작성일자', align: 'start', value: 'regDate' },
        ];

        // 페이지네이션에 따른 게시물 필터링
        const pagedItems = computed(() => {
            const startIdx = (pagination.value.page - 1) * perPage.value;
            const endIdx = startIdx + perPage.value;
            return boardStore.boards.slice(startIdx, endIdx);
        });

        // 페이지 수 계산
        const pageCount = computed(() => Math.ceil(boardStore.boards.length / perPage.value));

        // 게시물 작성 버튼 클릭
        const createPost = () => {
            console.log('게시물 작성 클릭');
            // 게시물 작성 로직 추가 필요
        };

        // 게시물 클릭 시 처리
        const readRow = (event: MouseEvent, { item }: any) => {
            console.log(`게시글 읽기: ${item.title}`);
            // 게시물 상세 페이지로 이동하는 로직 추가 필요
        };

        // 컴포넌트가 마운트되었을 때 데이터 요청
        onMounted(async () => {
            console.log('requestBoardListToDjango()')
            await boardStore.requestBoardListToDjango(); // 서버로부터 데이터 요청
        });

        return {
            perPage,
            pagination,
            headerTitle,
            pagedItems,
            createPost,
            readRow,
            pageCount,
        };
    },
});
</script>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
