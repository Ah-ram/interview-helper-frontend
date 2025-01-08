import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "path";

export default defineNuxtModule({
    meta: {
        name: "user_profile",
        configKey: "user_profile",
    },
    setup(moduleOptions, nuxt) {
        const themeDir = resolve(__dirname, "..");

        nuxt.hook("pages:extend", (pages) => {
            pages.push({
                name: "user-profile",
                path: "/user-profile",
                file: resolve(themeDir, "user_profile/pages/UserProfile.vue"),
            })
        })

        nuxt.hook("imports:dirs", (dirs) => {
            dirs.push(resolve(__dirname, "stores"))
        })
    }
})