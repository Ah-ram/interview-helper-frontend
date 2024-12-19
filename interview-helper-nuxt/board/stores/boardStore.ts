import { defineStore } from 'pinia';
import axiosInstance, {createAxiosInstances} from "../../utility/axiosInstance";

export const useBoardStore = defineStore('boardStore', {
    state: () => ({
        boards: [] as Array<{ boardId: number; title: string; writer: string; regDate: string }>,
    }),

    actions: {
        async requestBoardListToSpring() {
            const { springAxiosInst } = createAxiosInstances();

            try {
                const response = await springAxiosInst.get('/board/list');
                console.log('요청옴?', response);
                this.boards = response.data;
            } catch (error) {
                console.error('게시글 목록을 불러오는 중 오류가 발생했습니다:', error);
            }
        },
        async requestBoardToSpring(id: Number) {
            const { springAxiosInst } = createAxiosInstances();
            console.log("id:", id);

            try {
                const response = await springAxiosInst.get(`/board/read/${id}`)
                console.log("requestBoardToSpring() response:", response);
                return response.data;
            } catch (error) {
                console.error("requestBoardToSpring() 중 오류 발생:", error)
            }
        }
    }
});
