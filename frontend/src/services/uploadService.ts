
import type { upload } from "@/Types/upload"
import axiosInstance from "./axiosInstance"

export const fetchUploadsApi = async () => {
    const response = await axiosInstance.get('/api/uploads')
    return response.data
}

export const createUploadApi = async(formData: FormData) => {
    const response = await axiosInstance.post('/api/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    console.log('response ', response)
    return response.data
}

export const editUploadApi = async(formData: FormData) => {
    const response = await axiosInstance.put('/api/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    } )

    return response.data
}

export const deleteUploadApi = async(id: string) => {
    const response = await axiosInstance.delete(`/api/uploads?_id=${id}`)
    return response.data
}

export const reorderUploadsApi = async(uploads: Partial<upload>[]) => {
    const response = await axiosInstance.put('api/uploads/reorder', {uploads})
    return response.data
}