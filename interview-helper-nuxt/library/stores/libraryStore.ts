import { defineStore } from 'pinia';
import { createAxiosInstances } from "../../utility/axiosInstance";


export const useLibraryStore = defineStore('libraryStore', {
    state: () => ({
        directories: [] as Array<{ id: number | string; name: string; updateDate: string, createDate: string, isTemp: boolean, isSelected: boolean }>,
    }),

    actions: {
        async requestListDirectoryToSpring(): Promise<void> {
            const { springAxiosInst } = createAxiosInstances();

            try {
                const userToken = localStorage.getItem('userToken');
                const response = await springAxiosInst.post('/library/list-directory', { userToken: userToken });
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
        },
        async requestCheckDirectoryNameDuplicateToSpring(name: string) {
            const { springAxiosInst } = createAxiosInstances();

            try {
                const userToken = localStorage.getItem('userToken');
                const response = await springAxiosInst.post('/library/check-directory-name-duplicate', {
                    userToken: userToken,
                    name: name
                })
                return response.data;
            } catch (error) {
                console.error('requestCheckDirectoryNameDuplicateToSpring() 중 오류 발생:', error);
            }
        },
        async requestChangeDirectoryNameToSpring(directoryId: number, name: string) {
            const { springAxiosInst } = createAxiosInstances();

            try {
                const userToken = localStorage.getItem('userToken');
                const response = await springAxiosInst.put(`/library/change-directory-name/${directoryId}`, {
                    userToken: userToken,
                    name: name
                })
                console.log('change name response:', response.data)
                return response.data;
            } catch (error) {
                console.error('requestChangeDirectoryNameToSpring() 중 오류 발생:', error);
            }
        },
        async requestListQuestionToSpring(directoryName: string, categoryIndex: number) {
            const { springAxiosInst } = createAxiosInstances()

            try {
                const userToken = localStorage.getItem("userToken")
                const response = await springAxiosInst.post('/library/list-question', { userToken: userToken, directoryName: directoryName, categoryIndex: categoryIndex })
                console.log("requestListQuestionToSpring() response:", response)
                return response.data
            } catch (error) {
                console.error("requestListQuestionToSpring() 중 에러 발생:", error)
            }
        },
        async requestDeleteDirectoryToSpring(directoryId: number) {
            const { springAxiosInst } = createAxiosInstances()

            try {
                const userToken = localStorage.getItem('userToken')
                const response = await springAxiosInst.delete(`/library/delete-directory/${directoryId}`, {data:{ userToken: userToken }})
                console.log("deleteDirectory response:", response)
                return response.data
            } catch (error) {
                console.error('requestDeleteDirectoryToSpring() 중 에러 발생:', error)
            }
        },
        async requestMoveQuestionToSpring(directoryId: number, questionId: number) {
            const { springAxiosInst } = createAxiosInstances()

            try {
                const userToken = localStorage.getItem('userToken')
                console.log("userToken:", userToken)
                console.log("questionId:", questionId)
                const response = await springAxiosInst.put(`/library/move-question/${directoryId}`, { userToken: userToken, questionId: questionId })
                console.log("requestMoveQuestionToSpring() response:", response)

                return response.data
            } catch (error) {
                console.error("requestMoveQuestionToSpring() 중 에러 발생:", error)
            }
        },
        async requestSearchQuestionFromChromaDBViaSpring(query: string) {
            const { springAxiosInst } = createAxiosInstances()

            try {
                const userToken = localStorage.getItem('userToken')
                const response = await springAxiosInst.post("/ai-request/send", { userToken: userToken, command: 32, data: [query] })
                
                return response.data
            } catch (error) { 
                console.error("requestSearchQuestionFromChromaDBViaSpring() 중 에러 발생:", error)
            }
        },
        async requestSearchQuestionResultToFastAPI() {
            const { fastapiAxiosInst } = createAxiosInstances()

            const maxAttempts = 10
            const delay = 1000

            try {
                const userToken = localStorage.getItem("userToken")
                for (let attempt = 0; attempt < maxAttempts; attempt++) {
                    const response = await fastapiAxiosInst.post("/generate-questions-result", { userToken })
                    console.log("generatedQuestions: ", response.data)

                    if (response.data) {
                        return response.data;
                    }
                    
                    console.log(`${attempt + 1}번째 요청 실패!`)
                    await new Promise((resolve) => setTimeout(resolve, delay))
                }
                throw new Error("해당 검색어로 질문을 가져오는데 실패했습니다.")
            } catch (error) {
                console.error("requestSearchQuestionResultToFastAPI() 중 에러 발생: ", error)
            }
        }
    }
});
