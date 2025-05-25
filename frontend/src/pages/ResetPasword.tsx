import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { resetPasswordApi } from '@/services/authServices'
import { validateResetPassword } from '@/validation/validateResetPassword.'
import { Label } from '@radix-ui/react-label'
import { KeyRound, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'

const ResetPasword = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const email = location.state.email

    const [data, setData] = useState({
        otp: '',
        password: '',
        confirmPassword: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleSubmit = async () => {
        try {

            const error = validateResetPassword(data.otp, data.password, data.confirmPassword)
            if (error) {
                return toast.error(error)
            }

            setIsSubmitting(true)
            await resetPasswordApi(data.otp, email, data.password.trim())
            toast.success('success')
            navigate('/login')
        } catch (error: any) {
            console.error('error resetting password')
            error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error('something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col items-center p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
                <p className="text-gray-600">
                    We've sent a verification code to<br />
                    <span className="font-medium">{email}</span>
                </p>
            </div>

            <div className="space-y-6 w-sm">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Verification Code</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            value={data.otp}
                            onChange={(e) => setData({ ...data, otp: e.target.value })}
                            className="pl-10"
                            placeholder="Enter verification code"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">New Password</Label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="pl-10"
                            placeholder="Enter new password"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="password"
                            value={data.confirmPassword}
                            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                            className="pl-10"
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>

                <Button
                    className="w-full py-2"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                </Button>
            </div>
        </div>
    )
}

export default ResetPasword