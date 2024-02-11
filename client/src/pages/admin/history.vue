<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card rounded="xl" flat>
                    <v-card-text class="pa-1">
                        <v-data-table
                            v-model:items-per-page="itemsPerPage"
                            :page="page"
                            :items-length="totalItems"
                            :loading="loading"
                            @update:options="loadItems"
                            density="comfortable"
                            hover
                            :items="items"
                            color="primary"
                            :headers="headers"
                            item-value="id">
                            <template #item.date="{item}">
                                <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
                            </template>
                            <template #item.orderId="{item}">
                                <span>#{{ item.orderId.toString().padStart(6, '0') }}</span>
                            </template>
                            <template #item.total="{item}">
                                <span>{{ Number(item.total).toLocaleString('en-EN') }} so'm</span>
                            </template>
                            <template #bottom></template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-pagination v-model="page" @update:modelValue="loadItems" active-color="primary" density="comfortable" variant="flat"
                   :length="Math.ceil(totalItems / itemsPerPage)" :prev-icon="ClChevronLeftMd" :next-icon="ClChevronRightMd"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { get_orders } from '../../api/order'
import { ClChevronLeftMd, ClChevronRightMd } from '@kalimahapps/vue-icons'

const page = ref(1)
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(25)
const items = ref([])
const headers = ref([
    { title: 'ID', key: 'orderId', sortable: false },
    { title: 'Buyurtma raqami', key: 'name', sortable: false },
    { title: 'Buyurtma narxi', key: 'total', sortable: false },
    { title: 'Sana/Vaqt', key: 'date', sortable: false },
])
const loadItems =  async () => {
    loading.value = true
    const { data } = await get_orders({
        all: 1, 
        page: page.value,
        limit: itemsPerPage.value
    })
    items.value = data.result
    totalItems.value = data.total
    loading.value = false
}
</script>