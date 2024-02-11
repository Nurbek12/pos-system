<template>
    <v-container fluid class="h-screen">
        <v-row>
            <v-col cols="12">
                <v-menu :close-on-content-click="false">
                    <template #activator="{props}">
                        <v-btn v-bind="props">Kunlarni belgilash</v-btn>
                    </template>
                    <v-date-picker hide-header multiple="range" v-model="days" @update:model-value="logging"></v-date-picker>
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
import Apexchart from 'vue3-apexcharts'
import { ref, computed, reactive } from 'vue'
import { get_statistics } from '../../api/statistic'

const days = ref(new Date())
const orders = ref([])
const foods = ref([])
const filters = ref({
    day: new Date().toLocaleDateString()
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
            dataLabels: {
                position: 'top', // top, center, bottom
            },
        }
    },
    dataLabels: {
        enabled: true,
        // formatter: function (val) {
        //     return val + "%";
        // },
        offsetY: -20,
        style: {
            fontSize: '12px',
            colors: ["#304758"]
        }
    },

    xaxis: {
        categories: orders.value.map(d => d?.day),
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
    if(e.length === 1) {
        filters.value = {
            day: new Date(e[0]).toLocaleDateString()
        }
    }else{
        filters.value = {
            start: new Date(e.at(0)).toLocaleDateString(),
            end: new Date(e.at(-1)).toLocaleDateString()
        }
    }
    init()
}

const init = async () => {
    // console.log(filters.value);
    const { data } = await get_statistics(filters.value)
    orders.value = data?.find(d=> d?._id === 'order')?.data || []
    foods.value = data?.find(d=> d?._id === 'food')?.data || []
}

init()
</script>