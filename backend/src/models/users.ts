import mongoose from "mongoose";
import { User } from "../domain/entities/user";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    imagePublicId: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const userModel = mongoose.model<User>('users', userSchema)
export default userModel