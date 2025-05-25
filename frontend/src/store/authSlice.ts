import { loginApi, logoutApi, refreshTokenApi } from '@/services/authServices'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


export const login = createAsyncThunk('auth/login', async ({email, password}: {email: string, password: string}, { rejectWithValue }) => {
    try {
        const response = await loginApi(email, password)
        return response
    } catch (error: any) {
        return rejectWithValue(error?.response?.data || 'something went wrong')
    }
})


export const refreshToken = createAsyncThunk('auth/refreshToken', async (__, { rejectWithValue }) => {
    try {
        const response = await refreshTokenApi()
        return response
    } catch (error: any) {
        return rejectWithValue(error?.response?.data || 'something went wrong')
    }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await logoutApi()
        return response
    } catch (error) {
        return rejectWithValue('something went wrong')
    }
})
interface authState {
    accessToken: string | null
}

const initialState: authState = {
    accessToken: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken
        })

        .addCase(refreshToken.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken
        })

        .addCase(logout.fulfilled, state => {
            state.accessToken = null
        })


        
    }
})