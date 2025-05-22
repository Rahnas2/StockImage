import cloudinary, { ROOT_FOLDER } from "../config/cloudinary";
import { uploadResult } from "../Types/uploadResult";

export class CloudinaryService {
    uploadImage(buffer: Buffer, subFolder: string): Promise<uploadResult> {
        const folderPath = `${ROOT_FOLDER}/${subFolder}`
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder: folderPath},
                (error, result) => {
                if(result){
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    })
                }else {
                    reject(error)
                }
            })
            uploadStream.end(buffer)
        })
    }

    deleteImage(publicId: string) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if(result){
                    resolve(result)
                }else {
                    reject(error)
                }
            })
        })
    }
}