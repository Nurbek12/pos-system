<template>
    <v-app-bar flat color="background" class="px-2">
        <v-sheet rounded="xl" width="100%" color="white" class="overflow-hidden" height="50" elevation="0">
            <v-slide-group :show-arrows="false" mandatory v-model="category">
                <v-slide-group-item v-for="item,n in items" :key="n" v-slot="{ isSelected, toggle }">
                    <v-btn class="ma-2 text-body-2" rounded variant="flat" :color="isSelected ? 'primary' : undefined" @click="toggle">
                        <v-avatar size="20" rounded class="mr-2">
                            <v-img cover :src="`${baseURL}/file/${item?._id?.icon}`"></v-img>
                        </v-avatar>
                        {{ item?._id?.name }}
                    </v-btn>
                </v-slide-group-item>
                <template #next>
                    <v-btn rounded color="primary" variant="flat" size="40">
                        <AkChevronRight style="width: 20; height: 20;" />
                    </v-btn>
                </template>
                <template #prev>
                    <v-btn rounded color="primary" variant="flat" size="40">
                        <AkChevronLeft style="width: 20; height: 20;" />
                    </v-btn>
                </template>
            </v-slide-group>
        </v-sheet>
    </v-app-bar>
    <v-container fluid>
        <v-row>
            <v-col cols="6" md="8"  style="height: 90vh; overflow: auto;">
                <v-row style="height: 100%;">
                    <v-col cols="6" md="4" class="pa-2" v-for="food,i in items?.[category]?.foods||[]" :key="i">
                        <v-card rounded="xl" flat>
                            <div class="pa-2 pb-0 d-flex justify-center align-center">
                                <v-avatar size="120">
                                    <v-img :src="`${baseURL}/file/${food.image}`" cover></v-img>
                                </v-avatar>
                            </div>
                            <v-card-text class="pt-3 pb-2 text-center text-body-1 font-weight-medium">{{ food.name }}</v-card-text>
                            <v-card-text class="text-h6 pt-0 pb-1 text-center text-primary">{{ Number(food.price).toLocaleString('en-EN') }} so'm</v-card-text>
                            <v-card-actions>
                                <template v-if="cart.some(c => c._id === food._id)">
                                    <v-btn rounded @click="removeFromCart(food)" color="primary" variant="flat">
                                        <ChMinus />
                                    </v-btn>
                                    <div class="w-100 text-center text-h6">
                                        {{ cart.find(c => c._id === food._id)?.quantity }}
                                    </div>
                                    <v-btn rounded @click="addToCart(food)" color="primary" variant="flat">
                                        <GlPlus />
                                    </v-btn>
                                </template>
                                <v-btn v-else rounded @click="addToCart(food)" color="primary" variant="flat" block>Qo'shish</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6" md="4" class="pa-2">
                <v-card rounded="xl" flat>
                    <v-card-title>Buyurtma yaratish</v-card-title>
                    <v-card-text class="pb-0">
                        Buyurtma raqami: #{{ (orderId).toString().padStart(6, '0') }}
                        <span class="text-primary ml-4">{{ generatedFunction(orderId) }}</span>
                    </v-card-text>
                    <v-card-text class="pb-0">
                        <v-list>
                            <span class="text-grey text-subtitle-1" v-show="cart.length==0">Bo'sh</span>
                            <v-list-item v-for="c,i in cart" :key="i" class="px-0">
                                <template #prepend>
                                    <v-avatar size="60">
                                        <v-img cover :src="`${baseURL}/file/${c.image}`"></v-img>
                                    </v-avatar>
                                </template>
                                <v-list-item-title>{{ c.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ c.price }} so'm x {{ c.quantity }} = {{ Number(c.price * c.quantity).toLocaleString('en-EN') }} so'm</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-text>
                        Jami: {{ Number(total).toLocaleString('en-EN') }} so'm
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="create" :disabled="cart.length<=0" rounded color="primary" variant="elevated" block flat>Yaratish</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { baseURL } from '../../api'
import { get_menu } from '../../api/food'
import { create_food } from '../../api/socket'
import { get_counts, create_order } from '../../api/order'
import { GlPlus, ChMinus, AkChevronLeft, AkChevronRight } from '@kalimahapps/vue-icons'

const cart = ref([])
const items = ref([])
const orderId = ref(0)
const category = ref(0)
const total = computed(() => {
    return cart.value.reduce((a,b) => {
        return a+((b.price||0) * b.quantity)
    }, 0)
})

const addToCart = (item) => {
    const itemIndex = cart.value.findIndex((p) => p._id === item._id)
    if(itemIndex < 0) cart.value.push({...item, quantity: 1 })
    else cart.value[itemIndex].quantity += 1
}

const removeFromCart = (item) => {
    const itemIndex = cart.value.findIndex((p) => p._id === item._id)
    cart.value[itemIndex].quantity -= 1
    if(cart.value[itemIndex].quantity == 0) cart.value.splice(itemIndex, 1)
}

const generatedFunction = (n) => {
    var letterIndex = Math.floor((n - 1) / 99);
    var letter = String.fromCharCode((letterIndex % 26) + 65);
    var number = ((n - 1) % 99) + 1;
    return letter + '-' + number;
}

const init = async () => {
    const [m,c] = await Promise.all([
        get_menu(),
        get_counts()
    ])
    items.value = m.data
    orderId.value = c.data+1
}

const create = async () => {
    generatedFunction(orderId.value)
    const newOrder = {
        name: generatedFunction(orderId.value),
        total: total.value,
        foods: cart.value.map(({_id, quantity})=>({food: _id, quantity}))
    }
    const { data } = await create_order(newOrder)
    // console.log(data);
    create_food(data)
    orderId.value += 1
    cart.value = []
}

init()
</script>