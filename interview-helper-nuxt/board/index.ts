import { defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'board',
        configKey: 'board',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..');

        nuxt.hook('pages:extend', (pages) => {
            pages.push(
                {
                    name: 'board-list',
                    path: '/board/list',
                    file: resolve(themeDir, 'board/pages/BoardListPage.vue'),
                });
            pages.push(
                {
                    name: 'board-register',
                    path: '/board/register',
                    file: resolve(themeDir, 'board/pages/BoardRegisterPage.vue'),
                });
            pages.push(
                {
                    name: "board-read",
                    path: "/board/read/:id",
                    file: resolve(themeDir, "board/pages/BoardReadPage.vue")
                }
            )
            pages.push(
                {
                    name: "board-modify",
                    path: "/board/modify/:id",
                    file: resolve(themeDir, "board/pages/BoardModifyPage.vue")
                }
            )
        });

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'));
        });
    },
});
