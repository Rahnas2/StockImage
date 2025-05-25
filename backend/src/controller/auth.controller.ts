import { Request, Response ,NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { HttpStatusCode } from "../utils/statusCode";
import { UnauthorizedError } from "../utils/errors";

export class AuthController {
    constructor(private authService: AuthService) {}

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body

            const { accessToken, refreshToken } = await this.authService.login(email, password)
            console.log('refresh token after login ', refreshToken)

            console.log('node env ', process.env.NODE_ENV)
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
            res.redirect(HttpStatusCode.REDIRECT, `${process.env.CLIENT_URI}/email-verified?status=success&message=verified`)
        } catch (error) {   
            res.redirect(HttpStatusCode.REDIRECT, `${process.env.CLIENT_URI}/email-verified?status=failed&message=failed`)
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
            const { otp, email, newPassword } = req.body

            await this.authService.resetPassword(otp, email, newPassword)     
            res.status(HttpStatusCode.OK).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }

    refreshToken = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken
            console.log('refesh token', refreshToken)
            if(!refreshToken) {
                throw new UnauthorizedError('Unauthorized')
            }

            const accessToken = await this.authService.refreshToken(refreshToken)

            res.status(HttpStatusCode.OK).json({message: 'success', accessToken})
        } catch (error) {
            next(error)
        }
    }

    logout = async(req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('refreshToken')
            res.status(HttpStatusCode.OK).json({message: 'success'})
        } catch (error) {
            next(error)
        }
    }
}  