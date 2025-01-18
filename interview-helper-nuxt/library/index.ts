import { defineNuxtModule } from '@nuxt/kit';
import { resolve } from 'path';

export default defineNuxtModule({
    meta: {
        name: 'library',
        configKey: 'library',
    },

    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, '..');

        nuxt.hook('pages:extend', (pages) => {
            pages.push(
                {
                    name: 'library',
                    path: '/library',
                    file: resolve(themeDir, 'library/pages/LibraryMainPage.vue'),
                });
        });

        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(__dirname, 'store'));
        });
    },
});
