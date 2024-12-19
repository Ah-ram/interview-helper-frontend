import { createApp } from 'vue';
import App from './App.vue';
import router from '~/router/index.ts'; // 라우터 가져오기
import { createPinia } from 'pinia'; // Pinia 스토어

const app = createApp(App);

app.use(router);  // 라우터 등록
app.use(createPinia()); // Pinia 등록

app.mount('#app');
