<template>
    <v-navigation-drawer class="border-none rounded-e-xl" v-model="drawer" :rail="true" permanent width="250" elevation="0" :expand-on-hover="true">
        <v-list :lines="false" nav variant="flat">
            <v-list-item exact active-class="text-white" rounded="xl" link v-for="link, i in links" :key="i" :to="link.url" color="primary">
                <template v-slot:prepend>
                    <v-icon :icon="link.icon"></v-icon>
                </template>
                <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
  
<script setup>
import { ref, watch } from "vue"
import { useDisplay } from "vuetify"
import { BsBarChartLineFill, IoFastFood, MdRoundCategory, BsBagCheckFill, MiSolidListBox, ReChatHistoryFill } from '@kalimahapps/vue-icons'

const mobile = useDisplay().mobile;

watch(mobile, () => {
    if (mobile) rail.value = true;
});
const rail = ref(true)
const drawer = ref(true)

const links = [
    { title: 'Statistika', icon: BsBarChartLineFill, url: '/admin' },
    { title: 'Buyurtma', icon: BsBagCheckFill, url: '/admin/order' },
    { title: 'Sotuvlar', icon: MiSolidListBox, url: '/admin/list' },
    { title: 'Tarix', icon: ReChatHistoryFill, url: '/admin/history' },
    { title: 'Menyu', icon: IoFastFood, url: '/admin/menu' },
    { title: 'Kategoriyalar', icon: MdRoundCategory, url: '/admin/categories' },
]
</script>