import api from '.'

export const get_foods = () => api.get('/api/foods')

export const get_menu = () => api.get('/api/foods/menu-list')

export const create_food = (body) => api.post('/api/foods', body, { headers: { "Content-Type": "multipart/form-data" } })

export const update_food = (id, body) => api.put(`/api/foods/${id}`, body, { headers: { "Content-Type": "multipart/form-data" } })

export const delete_food = (id) => api.delete(`/api/foods/${id}`)