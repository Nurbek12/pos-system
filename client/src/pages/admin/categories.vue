<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="d-flex justify-end align-center pb-2">
                <v-btn @click="dialog = true" rounded color="primary" flat>Yaratish</v-btn>
            </v-col>
            <v-col cols="12">
                <v-card rounded="xl" flat>
                    <v-card-text class="px-1">
                        <v-data-table :items="items" :headers="headers" items-per-page="-1">
                            <template #bottom></template>
                            <template #item.image="{ item }">
                                <v-avatar size="45" rounded>
                                    <v-img cover :src="`${baseURL}/file/${item.image}`"></v-img>
                                </v-avatar>
                            </template>
                            <template #item.actions="{ item, index }">
                                <div class="d-flex ga-2">
                                    <v-btn size="40" color="primary" rounded flat @click="editItem(item, index)">
                                        <BxSolidPencil style="width: 20px; height: 20px;" />
                                    </v-btn>
                                    <v-btn size="40" color="primary" rounded flat @click="deleteItem(item.id, index)">
                                        <MdRoundDelete style="width: 20px; height: 20px;" />
                                    </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="550">
        <v-card>
            <v-card-title>Kategoriya yaratish</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-avatar rounded v-ripple size="150" class="cursor-pointer" @click="handleAddImage">
                            <v-img :src="currentImage" cover></v-img>
                        </v-avatar>
                        <input type="file" hidden id="file-input" @change="addImage">
                    </v-col>
                    <v-col cols="12">
                        <v-text-field color="primary" rounded variant="outlined" flat v-model="item.name" hide-details
                            label="Nomi"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-btn height="50" @click="save" color="primary" variant="flat" rounded block>Saqlash</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <div class="py-2"></div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { baseURL } from '../../api'
import { ref, reactive, computed } from 'vue'
import { MdRoundDelete, BxSolidPencil } from '@kalimahapps/vue-icons'
import { create_category, delete_category, get_categories, update_category } from '../../api/category'

const items = ref([])
const dialog = ref(false)
const itemIndex = ref(null)
const createLoading = ref(false)
const image = ref(null)

const headers = [
    { title: "Ikon", key: "image", sortable: false },
    { title: "Nomi", key: "name", sortable: false },
    { title: "Boshqarish", key: "actions", sortable: false },
]

const currentImage = computed(() => {
    if (image.value?.[0]) return URL.createObjectURL(image.value[0])
    return '/images/nophoto.jpg'
})

const item = reactive({
    name: "",
})

const handleAddImage = () => {
    document.getElementById('file-input')?.click()
}

const addImage = e => {
    image.value = e.target.files
}

const init = async () => {
    const { data } = await get_categories()
    items.value = data
}

const editItem = (d, index) => {
    Object.assign(item, d)
    itemIndex.value = index
    dialog.value = true
}

const deleteItem = async (id, index) => {
    if (!confirm('Вы хотите удалить это?')) return
    await delete_category(id)
    items.value.splice(index, 1)
}

const add = async (body) => {
    const { data } = await create_category(body)
    items.value.push(data)
}

const update = async (index, body) => {
    const id = body.get('id')
    body.delete('id')
    const { data } = await update_category(id, body)
    Object.assign(items.value[index], data)
}

const save = async () => {
    try {
        createLoading.value = true
        const formdata = new FormData()
        Object.keys(item).map(key => {
            formdata.append(key, item[key])
        })
        if (image.value?.[0]) formdata.append('file', image.value?.[0])
        if (itemIndex.value !== null)
            await update(itemIndex.value, formdata)
        else
            await add(formdata)
        close()
    } catch (error) {
        console.log(error);
    } finally {
        createLoading.value = false
    }
}

const close = () => {
    Object.assign(item, {
        name: ""
    })
    dialog.value = false
    itemIndex.value = null
    image.value = null
}

init()
</script>