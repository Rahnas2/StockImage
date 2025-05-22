import { AuthController } from "../controller/auth.controller";
import { otpRepository } from "../repositories/otp.repository";
import { userRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { CloudinaryService } from "../utils/cloudinayService";
import { Mailer } from "../utils/mailer";
import { Token } from "../utils/token";

const userRepo = new userRepository()
const otpRepo = new otpRepository()
const token = new Token()
const mailer = new Mailer()
const cloudinaryService = new CloudinaryService()

const authService = new AuthService(userRepo, otpRepo, token, mailer, cloudinaryService)   

const authController = new AuthController(authService)

export { authController }