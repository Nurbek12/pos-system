import api from '.'

export const get_categories = () => api.get('/api/categories')

export const create_category = (body) => api.post('/api/categories', body, { headers: { "Content-Type": "multipart/form-data" } })

export const update_category = (id, body) => api.put(`/api/categories/${id}`, body, { headers: { "Content-Type": "multipart/form-data" } })

export const delete_category = (id) => api.delete(`/api/categories/${id}`)