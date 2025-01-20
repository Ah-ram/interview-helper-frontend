import { defineStore } from 'pinia';
import { createAxiosInstances } from "../../utility/axiosInstance";

export const useLibraryStore = defineStore('libraryStore', {
    state: () => ({
        directories: [] as Array<{ id: number | string; name: string; updateDate: string, createDate: string, isTemp: boolean }>,
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
        async requestCreateDirectoryToSpring(name: string) {
            const { springAxiosInst } = createAxiosInstances();

            try {
                const userToken = localStorage.getItem('userToken');
                const response = await springAxiosInst.post('/library/create-directory', {
                    userToken: userToken,
                    name: name
                })
                return response.data;
            } catch (error) {
                console.error('requestCreateDirectoryToSpring() 중 오류 발생:', error);
            }
        }
    }
});
