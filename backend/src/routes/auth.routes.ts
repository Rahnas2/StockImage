import express from 'express'

import { authController } from '../di/container'
import upload from '../config/multer'
const router = express.Router()

router.post('/login', authController.login)
router.post('/register', upload.single('image'), authController.register)

router.get('/verify-email', authController.verifyEmail)

router.post('/send-otp', authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp)

router.post('/reset-password', authController.resetPassword)  

router.get('/refresh-token', authController.refreshToken)

router.post('/logout', authController.logout)

export default router