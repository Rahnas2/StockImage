import {v2 as cloudinary} from 'cloudinary'

cloudinary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure_distribution: 'http://localhost:8080',
})

export const ROOT_FOLDER =  'Stok-Image-Platform'

export default cloudinary