import mongoose, { mongo } from "mongoose";
import { Otp } from "../domain/entities/Otp";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expireAt: {
        type: Date,
        required: true  
    }
})

const otpModel = mongoose.model<Otp>('otps', otpSchema)

export default otpModel