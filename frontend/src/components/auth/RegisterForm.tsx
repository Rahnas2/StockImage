import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import React, { useState } from "react"
import { registerApi } from "@/services/authServices"
import { Label } from "../ui/label"
import toast from "react-hot-toast"
import { validateRegister } from "@/validation/validateRegister"

const RegisterForm = () => {

    const [data, setData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    })

    const [isLoading, setIsLoading] = useState(false)

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
            const error = validateRegister(data)
            if (error) {
                return toast.error(error)
            }

            setIsLoading(true)
            const result = await registerApi(data.name.trim(), data.email.trim(), data.mobile.trim(), data.password.trim())
            setData({
                name: '',
                email: '',
                mobile: '',
                password: '',
                confirmPassword: ''
            })
            toast.success(result.message)
        } catch (error: any) {
            console.error('error ', error)
            error?.response?.data?.message ? toast.error(error.response.data.message) : toast.error('something went wrong please try again')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="border rounded-md p-8 shadow-2xl md:w-sm">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Create an account</h3>
                <p className="text-sm opacity-90">Enter your details to create your account</p>
            </div>

            <div className="flex flex-col gap-5">

                <div>
                    <Label className="mb-3" htmlFor="name">Name</Label>
                    <Input type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder="example"
                        className='shadow-xs border-gray-400'
                        onChange={handleChange} />
                </div>

                <div>
                    <Label htmlFor="email" className="mb-3">Email</Label>
                    <Input type="email" value={data.email} id="email" name="email" placeholder="example@gmail.com"
                        className='shadow-xs border-gray-400'
                        onChange={handleChange} />
                </div>

                <div>
                    <Label htmlFor="mobile" className="mb-3">Mobile</Label>
                    <Input type="text" id="mobile" value={data.mobile} name="mobile" placeholder="0000000000"
                        className='shadow-xs border-gray-400'
                        onChange={handleChange} />
                </div>

                <div>
                    <Label htmlFor="password" className="mb-3">Password</Label>
                    <Input type="password" id="password" value={data.password} name="password" placeholder=""
                        className='shadow-xs border-gray-400'
                        onChange={handleChange} />
                </div>

                <div>
                    <Label htmlFor="confirmPassword" className="mb-3">Confirm Password</Label>
                    <Input type="password" id="confirmPassword" value={data.confirmPassword} name="confirmPassword" placeholder=""
                        className='shadow-xs border-gray-400'
                        onChange={handleChange} />
                </div>

                <Button disabled={isLoading} onClick={handleSubmit}>
                    {isLoading ? "loading..." : "Create Account"}
                </Button>

            </div>

            <div className="mt-5 text-sm flex gap-1">
                <span>Already have an account?</span>
                <Link to="/login" className="font-semibold hover:underline">login</Link>
            </div>

        </div>
    )
}

export default RegisterForm