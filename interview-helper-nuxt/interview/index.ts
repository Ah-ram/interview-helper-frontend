import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "path";

export default defineNuxtModule({
    meta: {
        name: "interview",
        configKey: "interview",
    },
    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, "..");

        nuxt.hook("pages:extend", (pages) => {
            pages.push({
                name: "interview",
                path: "/interview",
                file: resolve(themeDir, "interview/pages/InterviewMainPage.vue"),
            })
        })

        nuxt.hook("imports:dirs", (dirs) => {
            dirs.push(resolve(__dirname, "stores"))
        })
    }
})