import { Button } from "@/components/ui/button"
import type { AppDispatch } from "@/store"
import { logout } from "@/store/authSlice"
import { ImageIcon } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"

const Navbar = () => {

    const dispatch = useDispatch<AppDispatch>()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await dispatch(logout())
        } catch (error) {
            console.error('error logging out ', error)
        } finally {
            setIsLoading(false)
        }

    }
    return (

        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

            <div className="flex h-16 items-center justify-between px-15">
                <div className="flex items-center gap-2">
                    <ImageIcon className="h-6 w-6" />
                    <span className="font-semibold text-xl">Stock Image</span>
                </div>

                
                    <Button disabled={isLoading} onClick={handleLogout}>Logout</Button>

            </div>
        </header>
    )
}

export default Navbar