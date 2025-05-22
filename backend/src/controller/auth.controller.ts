import { Request, Response ,NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { HttpStatusCode } from "../utils/statusCode";

export class AuthController {
    constructor(private authService: AuthService) {}

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body

            const { accessToken, refreshToken } = await this.authService.login(email, password)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV  === 'production',
                sameSite: 'lax',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })

            res.status(HttpStatusCode.OK).json({accessToken})

        } catch (error) {
            next(error)
        }
    }

    register = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const {name, email, mobile, password} = req.body

            const image = req.file 

            await this.authService.register(name, email, mobile, password, image)

            res.status(HttpStatusCode.CREATED).json({message: `We have sent a verification link to your email (${email}). Please verify it before logging in.`})
        } catch (error) {
            next(error)
        }
    }

    verifyEmail = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.query

            await this.authService.verifyEmail(token as string)
            console.log('hello..')
            res.status(HttpStatusCode.OK).json({message: 'Email Verified'})   

        } catch (error) {   
            next(error)
        }
    }

    sendOtp = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body

            await this.authService.sendOtp(email)

            res.status(HttpStatusCode.OK).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }

    verifyOtp = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, otp} = req.body

            await this.authService.verifyOtp(email, otp)
            res.status(HttpStatusCode.OK).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }

    resetPassword = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, newPassword } = req.body

            await this.authService.resetPassword(email, newPassword)     
            res.status(HttpStatusCode.OK).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }
}  