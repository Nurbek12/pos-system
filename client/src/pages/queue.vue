<template>
    <v-container fluid class="h-screen bg-background">
        <v-row>
            <v-col cols="6">
                <v-sheet color="red-accent-3" rounded class="pa-2 text-center" height="100%">
                    <h2 class="mb-4 font-weight-light">TAYYORLANMOQDA</h2>
                    <v-table hover>
                        <tbody>
                            <tr v-for="item,i in notcompleted" :key="i">
                                <td class="text-h4 text-red-accent-3 font-weight-bold">{{ generatedFunction(item.id) }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-sheet>
            </v-col>
            <v-col cols="6">
                <v-sheet rounded color="green-accent-3" class="pa-2 text-center" height="100%">
                    <h2 class="mb-4 font-weight-light text-white">TAYYOR</h2>
                    <v-table hover>
                        <tbody>
                            <tr v-for="item,i in completed" :key="i">
                                <td class="text-h4 text-green-accent-3 font-weight-bold">{{ generatedFunction(item.id) }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { get_orders } from '../api/order'
import { food_completed, food_created, food_deleted } from '../api/socket'

const items = ref([])
const completed = computed(() => items.value.filter(i => i.completed))
const notcompleted = computed(() => items.value.filter(i => !i.completed))

const generatedFunction = (n) => {
    var letterIndex = Math.floor((n - 1) / 99);
    var letter = String.fromCharCode((letterIndex % 26) + 65);
    var number = ((n - 1) % 99) + 1;
    return letter + '-' + number
}

const init = async () => {
    const { data } = await get_orders({})
    items.value = data.result
}

init()

food_created(data => items.value.unshift(data))
food_completed((id) => {
    const index = items.value.findIndex(i => i.id === id)
    items.value[index] = {...items.value[index], completed:true}
})
food_deleted((id) => {
    const index = items.value.findIndex(i => i.id === id)
    items.value.splice(index, 1)
})
</script>