import type { RootState } from '@/store'
import React, { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

type Props = {
    children: ReactNode
}

const ProtectedRoute: React.FC<Props> = ({children}) => {

    console.log('coming here ')
    const { accessToken } = useSelector((state: RootState) => state.auth)
    console.log('access token in the protected route ', accessToken)
    if(!accessToken) {
        return <Navigate to="/login" replace/>
    }
    
    return children
}

export default ProtectedRoute