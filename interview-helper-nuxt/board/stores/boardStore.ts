import { defineStore } from 'pinia';
import axiosInstance, {createAxiosInstances} from "../../utility/axiosInstance";

export const useBoardStore = defineStore('boardStore', {
    state: () => ({
        boards: [] as Array<{ boardId: number; title: string; writer: string; regDate: string }>,
    }),

    actions: {
        async requestBoardListToDjango() {
            const { springAxiosInst } = createAxiosInstances();

            try {
                const response = await springAxiosInst.get('/board/list');
                console.log('요청옴?', response);
                this.boards = response.data;
            } catch (error) {
                console.error('게시글 목록을 불러오는 중 오류가 발생했습니다:', error);
            }
        },
        
        async requestBoardCreateToSpring(postData:{
            title: string,
            writer: string,
            content: string
        }) {
            const { springAxiosInst } = createAxiosInstances();
            try {
                const response = await springAxiosInst.post('/board/create', postData);
                return response.data;
            } catch (error) {
                console.error('requestBoardCreateToSPring 중 에러 발생:', error)
                throw error
            }
        }
    }
});
