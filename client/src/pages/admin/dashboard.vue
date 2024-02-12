<template>
    <v-container fluid class="h-screen">
        <v-row>
            <v-col cols="12">
                <v-menu :close-on-content-click="false">
                    <template #activator="{props}">
                        <v-btn rounded color="primary" flat v-bind="props">Kunlarni belgilash</v-btn>
                    </template>
                    <v-date-picker flat rounded="xl" color="primary" mandatory hide-header multiple="range" v-model="days" @update:model-value="logging"></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" md="6">
                <v-card rounded="xl" flat>
                    <v-card-text>
                        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card rounded="xl" flat>
                    <v-card-text>
                        <apexchart type="donut" height="360" :options="donut_chartOptions" :series="donut_series"></apexchart>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import Apexchart from 'vue3-apexcharts'
import { get_statistics, get_food_statistics } from '../../api/statistic'

const days = ref(new Date())
const orders = ref([])
const foods = ref([])
const filters = ref({
    gt: new Date(),
    lt: new Date(),
})
const series = computed(() => ([{
    name: 'Sotuvlar soni',
    data: orders.value.map(d => d?.quantity)
}]))
const chartOptions = computed(() => ({
    chart: {
        height: 350,
        type: 'bar',
    },
    fill: {
        colors: ['#FF1744']
    },
    plotOptions: {
        bar: {
            borderRadius: 10,
            columnWidth: 50,
            dataLabels: {
                position: 'top', // top, center, bottom
            },
        }
    },
    dataLabels: {
        enabled: true,
        offsetY: -25,
        style: {
            fontSize: '12px',
            colors: ["#304758"]
        }
    },

    xaxis: {
        categories: (orders.value.length>0?orders.value.map(d => d?.day):[new Date().toLocaleDateString()]),
        position: 'top',
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        crosshairs: {
            fill: {
                type: 'gradient',
                gradient: {
                    colorFrom: '#D8E3F0',
                    colorTo: '#BED1E6',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                }
            }
        },
        tooltip: {
            enabled: false,
        }
    },
    yaxis: {
        axisBorder: {
            how: false
        },
        axisTicks: {
            show: false,
        },
        labels: {
            show: false,
            // formatter: function (val) {
            //     return val + "%";
            // }
        }

    },
}))

const donut_series = computed(() => foods.value.map(f => f.quantity))
const donut_chartOptions = computed(() => ({
    chart: {
        type: 'donut',
    },
    labels: foods.value.map(f => f.name),
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }],
}))

const logging = (e) => {
    if(e.length === 0) return
    filters.value = {
        gt: new Date(e.at(0)),
        lt: new Date(e.at(-1)||e.at(0))
    }
    init()
}

const init = async () => {
    filters.value.gt.setHours(0,0,0,0)
    filters.value.lt.setHours(23, 59, 59, 999);
    const { data } = await get_statistics(filters.value)
    orders.value = Object.keys(data).map((key) => ({ day: key, quantity: data[key] }))

    const f = await get_food_statistics(filters.value)
    foods.value = Object.keys(f.data).map((key) => ({ name: key, quantity: f.data[key] }))
}

init()
</script>