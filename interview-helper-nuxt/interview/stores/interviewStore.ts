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
                throw new Error("면접 질문을 가져오는데 실패했습니다.")
            } catch (error) {
                console.error("requestGeneratedQuestionsResultToFastAPI() 중 에러 발생: ", error)
            }
        },
        async requestSaveQuestionListToSpring(titleList: string[], categoryIndex: number) {
            const { springAxiosInst } = createAxiosInstances()

            try {
                const userToken = localStorage.getItem("userToken")
                const response = await springAxiosInst.post("/question/create", { userToken: userToken, titleList: titleList, categoryIndex: categoryIndex })
                console.log("requestSaveQuestionListToSpring() response:", response)

                return response.data
            } catch (error) {
                console.error("requestSaveQuestionListToSpring() 중 에러 발생:", error)
            }
        }
    }
});
