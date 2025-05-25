import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'
import GuestOnlyRoute from './GuestOnlyRoute'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { refreshToken } from '@/store/authSlice'
import type { AppDispatch } from '@/store'
import EmailVerification from '@/pages/EmailVerification'
import ResetPasword from '@/pages/ResetPasword'

const AppRoute = () => {

    const dispatch = useDispatch<AppDispatch>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuthorized = async () => {
            try {
                setIsLoading(true)
                await dispatch(refreshToken()).unwrap()
            } catch (error) {
                console.error('error refresh token ', error)
            } finally {
                setIsLoading(false)
            }
        }
        checkAuthorized()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Routes>
            <Route path='/' element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>}
            />

            <Route path='/register' element={
                <GuestOnlyRoute>
                    <Register />
                </GuestOnlyRoute>}
            />

            <Route path='/login' element={
                <GuestOnlyRoute>
                    <Login />
                </GuestOnlyRoute>}
            />

            <Route path='/reset-password' element={
                <GuestOnlyRoute>
                    <ResetPasword />
                </GuestOnlyRoute>
            } />

            <Route path='/email-verified' element={<EmailVerification />} />
        </Routes>
    )
}

export default AppRoute
