
import mongoose from "mongoose";
import { Upload } from "../domain/entities/upload";

const uploadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    imagePublicId: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const uploadModel  = mongoose.model<Upload>('uploads', uploadSchema)

export default uploadModel