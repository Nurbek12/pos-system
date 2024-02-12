<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card rounded="xl" flat>
                    <v-card-text class="pa-1">
                        <v-data-table
                            color="primary"
                            v-model:expanded="expanded"
                            items-per-page="-1"
                            :headers="headers"
                            density="comfortable"
                            hover
                            :items="items"
                            show-expand
                            item-value="completed">
                            <template v-slot:expanded-row="{ columns,item }">
                                <tr>
                                    <td :colspan="columns.length">
                                        <v-table>
                                            <tbody>
                                                <tr v-for="food,i in item.order_items" :key="i">
                                                    <td>
                                                        <v-avatar class="mr-4">
                                                            <v-img cover :src="`${baseURL}/file/${food.food.image}`"></v-img>
                                                        </v-avatar>
                                                        <span class="text-primary text-subtitle-1 font-weight-bold">{{ food.quantity }}x</span> -
                                                        {{ food.food.name }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </v-table>
                                    </td>
                                </tr>
                            </template>
                            <template #bottom></template>
                            <template #item.completed="{item, index}">
                                <v-chip v-show="item.completed" @click="handleDelete(item.id, index)" color="green" variant="flat">
                                    Tayyor
                                </v-chip>
                                <v-chip v-show="!item.completed" @click="handleComplete(item.id, index)" color="red" variant="flat">
                                    Tayyorlanmoqda
                                </v-chip>
                            </template>
                            <template #item.name="{item}">
                                <span>{{ generatedFunction(item.id) }}</span>
                            </template>
                            <template #item.orderId="{item}">
                                <span>#{{ item.id.toString().padStart(6, '0') }}</span>
                            </template>
                            <template #item.date="{item}">
                                <span>{{ new Date(item.created_at).toLocaleString() }}</span>
                            </template>
                            <template #item.total="{item}">
                                <span>{{ Number(item.total).toLocaleString('en-EN') }} so'm</span>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { baseURL } from '../../api'
import { food_created, complete_food, delete_food } from '../../api/socket'
import { get_orders, archive_order, complete_order } from '../../api/order'

const items = ref([])
const expanded = ref([false])

const headers = [
    { title: 'ID', key: 'orderId', sortable: false },
    { title: 'Buyurtma raqami', key: 'name', sortable: false },
    { title: 'Buyurtma narxi', key: 'total', sortable: false },
    { title: 'Holati', key: 'completed', sortable: false },
    { title: 'Sana/Vaqt', key: 'date', sortable: false },
]

const generatedFunction = (n) => {
    var letterIndex = Math.floor((n - 1) / 99);
    var letter = String.fromCharCode((letterIndex % 26) + 65);
    var number = ((n - 1) % 99) + 1;
    return letter + '-' + number
}

const init = async () => {
    const { data } = await get_orders({})
    console.log(data);
    items.value = data.result
}

const handleComplete = async (id, index) => {
    items.value[index].completed = true
    complete_food(id)
    await complete_order(id)
}

const handleDelete = async (id, index) => {
    delete_food(id)
    items.value.splice(index, 1)
    await archive_order(id)
}

init()

food_created(data => items.value.unshift(data))
</script>