<template>
    <v-container class="bg-background h-screen" fluid>
        <v-row>
            <v-col cols="12">
                <div class="text-center">
                    <h2 class="text-primary font-weight-light">TAOMLAR MENYUSI</h2>
                </div>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="item,i in foods" :key="i" class="pa-1">
                <v-sheet>
                    <v-list>
                        <v-list-item>
                            <template #prepend>
                                <v-avatar rounded>
                                    <v-img :src="`${baseURL}/file/${item._id?.icon}`"></v-img>
                                </v-avatar>
                            </template>
                            <v-list-item-title class="font-weight-bold text-primary">{{ item._id?.name }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                    <v-table density="compact" hover>
                        <tbody>
                            <tr v-for="food,j in item.foods" :key="j">
                                <td>
                                    <div class="d-flex align-center ga-4 py-1">
                                        <v-avatar size="45" rounded>
                                            <v-img cover :src="`${baseURL}/file/${food.image}`"></v-img>
                                        </v-avatar>
                                        <span>{{ food.name }}</span>
                                    </div>
                                </td>
                                <td class="text-right text-primary font-weight-medium">{{ Number(food.price).toLocaleString('en-EN') }} so'm</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { baseURL } from '../api'
import { get_menu } from '../api/food'

const foods = ref([])

const init = async () => {
  const { data } = await get_menu()
  console.log(data);
  foods.value = data
}

init()
</script>