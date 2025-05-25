import axiosInstance from "./axiosInstance"

export const loginApi = async (email: string, password: string) => {
    const response = await axiosInstance.post('/api/auth/login', {email, password})
    return response.data
}

export const registerApi = async(name: string, email: string, mobile: string, password: string) => {
    const response = await axiosInstance.post('/api/auth/register', {name, email, mobile, password} )
    return response.data
}

export const refreshTokenApi = async() => {
    const response = await axiosInstance.get('/api/auth/refresh-token')
    return response.data
}

export const logoutApi = async() => {
    const response = await axiosInstance.post('/api/auth/logout')
    return response.data
}

export const sendOtpApi = async (email: string) => {
    const response = await axiosInstance.post('/api/auth/send-otp', {email})
    return response.data
}

export const resetPasswordApi = async (otp: string, email: string, newPassword: string) => {
    const response = await axiosInstance.post('/api/auth/reset-password', {otp, email, newPassword})
    return response.data
}