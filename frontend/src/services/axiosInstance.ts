
import axios from 'axios'
import { store } from '@/store'
import { logout, refreshToken } from '@/store/authSlice'

const baseURL = import.meta.env.VITE_BACKEND_URI


const axiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const token = state.auth.accessToken

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('response ', error)
        const originalRequest = error.config

        if (error.response.status === "401" && error.response.message === "Unauthorized" && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const response = await store.dispatch(refreshToken()).unwrap()
                const newToken = response.accessToken
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axiosInstance(originalRequest)
            } catch (error) {
                await store.dispatch(logout())
                return Promise.reject(error)
            }
        }

        return Promise.reject(error);
    }
)

export default axiosInstance