import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors";
import { Mailer } from "../utils/mailer";

import { Bcrypt } from "../utils/password";

import { Token } from "../utils/token";
import { TokenPayload } from "../domain/interfaces/TokenPayload";
import { generateOTP } from "../utils/generateOtp";
import { IOtpRepository } from "../domain/interfaces/IOtpRepository";
import { CloudinaryService } from "../utils/cloudinayService";

export class AuthService {
    constructor(private userRepository: IUserRepository,
        private otpRepository: IOtpRepository,
        private token: Token,
        private mailer: Mailer,
        private cloudinaryService: CloudinaryService
    ) { }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new UnauthorizedError('Invalid email or password')
        }

        const isValid = await Bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new UnauthorizedError('invalid email or password')
        }

        if (!user.isVerified) {
            throw new UnauthorizedError('Account not verified yet')
        }

        const accessToken = this.token.genereteAccessToken({ userId: user._id as string, email: user.email })
        const refreshToken = this.token.generateRefreshToken({ userId: user._id as string, email: user.email })

        return { accessToken, refreshToken }
    }


    async register(name: string, email: string, mobile: string, password: string, file?: Express.Multer.File ) {
        const existringUser = await this.userRepository.findByEmail(email)
        if (existringUser) {
            throw new ConflictError('email already in use')
        }

        let image;
        let imagePublicId;
        if(file){
            const {url, publicId} = await this.cloudinaryService.uploadImage(file.buffer, 'profile')
            image = url
            imagePublicId = publicId
        }

        const hashedPassword = await Bcrypt.hash(password)

        const user = await this.userRepository.create({ name, email, mobile, password: hashedPassword, image, imagePublicId })

        const verificationToken = this.token.generateToken(user._id as string)
        console.log('verificaion token ', verificationToken)

        const verificationLink = `http://localhost:5050/api/auth/verify-email?token=${verificationToken}`

        await this.mailer.sendVerificationMail(email, verificationLink)
    }


    async verifyEmail(token: string) {

        const Token = await this.token.verifyToken(token) as Omit<TokenPayload, 'email'>

        const userId = Token.userId

        const updatedData = await this.userRepository.findByIdAndUpdate(userId, { isVerified: true })

        if (!updatedData) {
            throw new NotFoundError('user not found')
        }
    }

    async sendOtp(email: string) {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
            throw new UnauthorizedError('Invalid email or password')
        }

        // Generate Otp 
        const otp = generateOTP()
        console.log('otp')

        await this.mailer.sendOtp(user.email, otp)

        const hashedOtp = await Bcrypt.hash(otp)

        const existingOtp = await this.otpRepository.findByEmail(email)
        if(existingOtp){
            await this.otpRepository.findByEmailAndDelete(email)
        }

        await this.otpRepository.create({
            email,
            otp: hashedOtp,
            expireAt: new Date(Date.now() + (10 * 60 * 1000))
        })

    }

    async verifyOtp(email: string, otp: string) {
        const data = await this.otpRepository.findByEmail(email)

        if(!data || data.expireAt < new Date){
            throw new UnauthorizedError('Invalid or Expire OTP')
        }

        const isMatch = await Bcrypt.compare(otp, data.otp)

        if(!isMatch){
            throw new UnauthorizedError('Invalid Otp')
        }
    }

    async resetPassword(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email)
        if(!user){
            throw new UnauthorizedError('user not found')
        }

        const hashedPassword = await Bcrypt.hash(password)
        
        await this.userRepository.findByIdAndUpdate(user._id, {password: hashedPassword}) 
    }


}