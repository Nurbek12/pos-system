import api from '.'

export const get_statistics = (q) => api.get('/api/statistics', { params: q })

export const get_food_statistics = (q) => api.get('/api/statistics/foods', { params: q })