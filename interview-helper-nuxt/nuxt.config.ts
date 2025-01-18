import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: ['./board/nuxt.config.ts',
        './authentication/nuxt.config.ts', 
        './interview/nuxt.config.ts', 
        './user_profile/nuxt.config.ts', 
        './library/nuxt.config.ts'
    ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css',

  ],

  build: {
    
    transpile: ['vuetify'] // Vuetify를 빌드 시 트랜스파일링
  },

  vite: {
    ssr: {
      noExternal: ['vuetify'] // SSR에서도 Vuetify를 외부 패키지로 처리하지 않도록 설정
    }
  },

  modules: [
      'vuetify-nuxt-module',
      '@pinia/nuxt',
      '@nuxtjs/google-fonts',
      '~/board/index.ts',
      '~/authentication/index.ts',
      '~/interview/index.ts',
      '~/user_profile/index.ts',
      '~/library/index.ts'
  ],

  googleFonts: {
    families: {
      'Material+Icons': true,
    }
  },

  imports: {
    dirs: ['./stores']
  },

  runtimeConfig: {
    public: {
      MAIN_API_URL: process.env.NUXT_PUBLIC_BASE_URL,
      AI_BASE_URL: process.env.NUXT_PUBLIC_AI_BASE_URL,
      AWS_REGION: process.env.NUXT_PUBLIC_AWS_REGION,
      AWS_S3_IDENTITY_POOL: process.env.NUXT_PUBLIC_AWS_S3_IDENTITY_POOL_ID,
      BUCKET_NAME: process.env.NUXT_PUBLIC_AWS_S3_BUCKET_NAME,
    },
  },
})