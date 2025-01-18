import { defineStore } from 'pinia';
import { createAxiosInstances } from "../../utility/axiosInstance";

export const useLibraryStore = defineStore('libraryStore', {
    state: () => ({
        directories: [] as Array<{ id: number; name: string; updateDate: string }>,
    }),

    actions: {
        async requestListDirectoryToSpring(): Promise<void> {
            const { springAxiosInst } = createAxiosInstances();

            try {
                const userToken = localStorage.getItem('userToken');
                const response = await springAxiosInst.post('/library/list-directory', { userToken: userToken });
                console.log('response:', response)
                this.directories = response.data;
            } catch (error) {
                console.error('requestListDirectoryToSpring() 중 오류 발생:', error);
            }
        },
    }
});
