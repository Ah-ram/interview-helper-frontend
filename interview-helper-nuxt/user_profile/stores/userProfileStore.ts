import { defineStore } from 'pinia'
import { createAxiosInstances } from '../../utility/axiosInstance'

export const useUserProfileStore = defineStore('userProfileStore', {
    state: () => ({
      changedUserProfile: false
    }),
    actions: {
      async requestUserInfoToSpring(): Promise<any> {
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
      async requestChangePictureToSpring(imageUrl: string) {
        const { springAxiosInst } = createAxiosInstances()

        try {
          const userToken = localStorage.getItem('userToken')
          const payload = { userToken: userToken, imageUrl: imageUrl }
          const response = await springAxiosInst.put('/user-profile/change-picture', payload)
          return response.data
        } catch (error) {
          console.error('requestChangePictureToSpring 중 에러 발생: ', error)
        }
      },
    }
})