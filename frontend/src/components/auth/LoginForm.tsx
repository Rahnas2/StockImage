
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '@/store/authSlice'
import type { AppDispatch } from '@/store'
import toast from 'react-hot-toast'
import { validateLogin } from '@/validation/validateLogin'
import ForgotPasswordDialog from './ForgotPasswordDialog'

const LoginForm = () => {

    const dispatch = useDispatch<AppDispatch>()
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const [isLoading, setIsLoading] = useState(false)

    const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const { name, value } = e.target

            setData({ ...data, [name]: value })

        } catch (error) {
            console.error('error ', error)
        }
    }

    const handleSubmit = async () => {
        try {

            //Validation 
            const error = validateLogin(data)
            if(error){
                return toast.error(error)
            }


            setIsLoading(true)
            await dispatch(login(data)).unwrap()
            toast.success('success')
        } catch (error: any) {
            console.error('error login ', error)
            toast.error(error.message) 
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
        <div className='border rounded-md p-8 shadow-2xl'>

            <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold mb-2'>Login</h3>
                <p className='text-sm opacity-90'>Enter your email and password to sign in to your account</p>
            </div>

            <div className='flex flex-col gap-5'>

                <div>
                    <Label className='mb-3' htmlFor="email">Email</Label>
                    <Input type="email"
                        id="email"
                        name='email'
                        value={data.email}
                        placeholder="example@gmal.com"
                        className='shadow-xs border-gray-400'
                        onChange={handleChange} />
                </div>

                <div>
                    <Label className='mb-3' htmlFor="password">Password</Label>
                    <Input type="password" id="password" name='password' value={data.password} placeholder=""
                        className='shadow-xs border-gray-400'
                        onChange={handleChange} />
                </div>

                <div className='text-end'>
                    <button onClick={() => setIsForgotPasswordDialogOpen(true)} className='text-sm opacity-90 hover:opacity-100 hover:underline cursor-pointer'>forgot password ?</button>
                    </div>

                <Button disabled={isLoading} onClick={handleSubmit}>
                    {isLoading ? 'loading...' : 'Login'}
                </Button>

            </div>

            <div className='mt-5 text-sm flex gap-1'>
                <span>Don't have an account?</span>
                <Link to="/register" className='font-semibold hover:underline'>Register</Link>
            </div>

        </div>

        <ForgotPasswordDialog  
        onOpen={isForgotPasswordDialogOpen}
        onOpenChange={setIsForgotPasswordDialogOpen}/>
        </>
    )
}

export default LoginForm