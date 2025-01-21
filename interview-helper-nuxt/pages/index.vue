<!-- pages/index.vue -->
<template>
    <v-app>
        <v-main>
            <nav>
                <div class="homepage">
                    <h2 class="main-text">서비스 준비중입니다!</h2>
                    <home />
                </div>  
            </nav>            
        </v-main>
    </v-app>
</template>

<script setup>
import home from './home.vue';
</script>

<style scoped>
.main-text {
    position: absolute;
    font-size: 1rem;
    color: #fff;
    text-align: center;
}
.homepage {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    scale: 3
}
</style>
