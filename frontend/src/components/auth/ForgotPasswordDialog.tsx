import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { sendOtpApi } from '@/services/authServices'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

type Props = {
    onOpen: boolean,
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const ForgotPasswordDialog: React.FC<Props> = ({onOpen, onOpenChange}) => {

    const navigate = useNavigate()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [email, setEmail] = useState('')

    const handleSubmit = async () => {
        try {

            if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return toast.error("Valid email is required")

            setIsSubmitting(true)
            await sendOtpApi(email)
            navigate('/reset-password', {state: { email }})  
        } catch (error: any) {
            console.error('error sending otp ', error)
            error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error('something went wrong please try again')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={onOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="text-center mb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</DialogTitle>
                    <p className="text-gray-600">
                        Enter your email address.
                    </p>
                </DialogHeader>

                <div className="space-y-6">
                    <div>
                        <Label className="mb-3" htmlFor="email" >
                            Email Address
                        </Label>
                        <div className="relative">
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className=""
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div className='flex justify-center'>
                        <Button disabled={isSubmitting} onClick={handleSubmit} className="w-[80%]" >
                        {isSubmitting ? "loading..." : 'Submit'}
                    </Button></div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ForgotPasswordDialog