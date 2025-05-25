import type { RootState } from "@/store"
import type React from "react"
import type { ReactNode } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

type Props = {
    children: ReactNode
}

const GuestOnlyRoute: React.FC<Props> = ({children}) => {

    const { accessToken } = useSelector((state: RootState) => state.auth)
    console.log('access token guest only route', accessToken)

    if(accessToken){
        return <Navigate to="/" replace/>
    }
    
    return children
}

export default GuestOnlyRoute