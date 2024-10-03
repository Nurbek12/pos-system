import axios, {} from 'axios'

export const baseURL = 'http://localhost:4000'
// export const baseURL = ''

// const api = axios.create({ baseURL })
const api = axios.create({ baseURL })
// const store = useAppStore()

api.interceptors.response.use(
    (resp) => {
        // checkToken()
        return resp
    },
    (err) => {
        if(err.response && err.response.status === 401) {
            // store.push_alert("Время токена стекло", "warning")
            // store.log_out();
            return
        }
        return Promise.reject(err)
    }
)

export const checkToken = () => {
    // const token = store.token||''
    // api.defaults.headers.common.Authorization = `Bearer ${token}`
}

checkToken()

export default api