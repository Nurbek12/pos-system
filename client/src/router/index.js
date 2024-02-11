import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('../pages/menu.vue') },
        { path: '/login', component: () => import('../pages/login.vue') },
        { path: '/admin', component: () => import('../pages/admin/index.vue'),
            // beforeEnter: (to, from, next) => {
            //     if(to.query?.login=='admin'&&to.query?.pass==123) next()
            //     else next('/')
            // },
            children: [
                { path: '', component: () => import('../pages/admin/dashboard.vue') },
                { path: 'order', component: () => import('../pages/admin/orders.vue') },
                { path: 'history', component: () => import('../pages/admin/history.vue') },
                { path: 'list', component: () => import('../pages/admin/order-list.vue') },
                { path: 'menu', component: () => import('../pages/admin/menu.vue') },
                { path: 'categories', component: () => import('../pages/admin/categories.vue') },
            ]
        },
        { path: '/queue', component: () => import('../pages/queue.vue') },
    ]
})