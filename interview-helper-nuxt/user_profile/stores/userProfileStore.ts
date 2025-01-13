import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

interface UserInfo {
  email: string
  name: string
}

export const useUserProfileStore = defineStore('userProfileStore', {
    state: () => ({}),
    actions: {
      async requestUserInfoToSpring(): Promise<void> {
        const { springAxiosInst } = createAxiosInstances()
  
        try {
          const userToken = localStorage.getItem('userToken')
          const response = await springAxiosInst.post('/user-profile/userinfo', { userToken: userToken })
          return response.data
        } catch (error) {
          console.error('requestUserInfoToSpring 중 에러가 발생했습니다:', error)
          throw error
        }
      },
      async requestNicknameDuplicationCheckToSpring(nickname: string): Promise<boolean> {
        const { springAxiosInst } = createAxiosInstances()

        try {
          const userToken = localStorage.getItem('userToken')
          const response = await springAxiosInst.post('user-profile/check-nickname-duplicate', {
            userToken: userToken,
            nickname: nickname
          })
          return response.data
        } catch (error) {
          console.error('requestNicknameDuplicationToSpring() 중 에러 발생:', error)
          throw error
        }
      },
      async requestChangeNicknameToSpring(nickname: string) {
        const { springAxiosInst } = createAxiosInstances()

        try {
          const userToken = localStorage.getItem('userToken')
          const payload = { userToken: userToken, nickname: nickname}
          const response = await springAxiosInst.put('user-profile/change-nickname', payload)
          return response.data
        } catch (error) {
          console.error('requestChangeNicknameToSpring() 중 에러 발생:', error)
          throw error
        }
      },
    }
})