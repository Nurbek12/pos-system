import api from '.'

export const get_statistics = (q) => api.get('/api/statistics', { params: q })