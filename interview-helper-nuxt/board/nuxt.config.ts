// board/nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
    router: {
        options: {
            strict: true, // 경로 구분 엄격 설정 (선택사항)
        },
        extendRoutes(routes, resolve) {
            // 페이지 파일이 있는 위치를 명시적으로 추가
            routes.push({
                name: 'board-list',
                path: '/board/list',
                component: resolve(__dirname, 'pages/list.vue'), // 게시판 목록 페이지
            });
        },
    },
});
