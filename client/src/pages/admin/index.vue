<template>
    <v-app>
        <navigation />
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import Navigation from '../../components/navigation.vue'
</script>