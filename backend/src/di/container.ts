import { AuthController } from "../controller/auth.controller";
import { UploadController } from "../controller/upload.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { otpRepository } from "../repositories/otp.repository";
import { uploadRepository } from "../repositories/upload.repository";
import { userRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { UploadService } from "../services/upload.service";
import { CloudinaryService } from "../utils/cloudinayService";
import { Mailer } from "../utils/mailer";
import { Token } from "../utils/token";

const userRepo = new userRepository()
const otpRepo = new otpRepository()
const uploadRepo = new uploadRepository()

const token = new Token()
const mailer = new Mailer()
const cloudinaryService = new CloudinaryService()

const authService = new AuthService(userRepo, otpRepo, token, mailer, cloudinaryService)   
const uploadService = new UploadService(cloudinaryService, uploadRepo)

const authController = new AuthController(authService)
const uploadController = new UploadController(uploadService)

const authMiddleware = new AuthMiddleware(token)

export { authController, uploadController, authMiddleware }