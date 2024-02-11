import api from '.'

export const get_orders = (q) => api.get('/api/orders', { params: q })

export const get_counts = () => api.get('/api/orders/count')

export const create_order = (body) => api.post('/api/orders', body)

export const complete_order = (id) => api.put(`/api/orders/complete/${id}`)

export const archive_order = (id) => api.put(`/api/orders/archive/${id}`)