<template>
    <v-app>
        <NavigationMenuBar />
        <v-main>
            <NuxtPage />
            <!--            <NuxtLink to="/">Home</NuxtLink>-->
        </v-main>
    </v-app>
</template>

<script>
// import router from '~/router/index.ts'
import NavigationMenuBar from './navigation_bar/NavigationMenuBar.vue';

export default {
    components: {
        NavigationMenuBar
    },
}
</script>


<style>
.v-main {
    background-color: #121212;
}
</style>