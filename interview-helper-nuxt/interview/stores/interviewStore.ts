import { defineStore } from 'pinia';
import { createAxiosInstances } from "../../utility/axiosInstance";

export const useInterviewStore = defineStore('interviewStore', {
    actions: {
        async requestGenerateQuestionsToFastAPI(category: string) {
            const { fastapiAxiosInst } = createAxiosInstances();

            try {
                const command = 6
                const userToken = localStorage.getItem("userToken")
                const response = await fastapiAxiosInst.post("/request-ai-command", { command, data: [userToken, category]})
                
                return response.data
            } catch (error) {
                console.error('requestGenerateQuestionsToFastAPI() 중 에러 발생: ', error);
            }
        },
        async requestGeneratedQuestionsResultToFastAPI() {
            const { fastapiAxiosInst } = createAxiosInstances()

            try {
                const userToken = localStorage.getItem("userToken")
                const response = await fastapiAxiosInst.post("/generate-questions-result", { userToken })
                
                return response.data.message;
            } catch (error) {
                console.error("requestGeneratedQuestionsResultToFastAPI() 중 에러 발생: ", error)
            }
        },
    }
});
