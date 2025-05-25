import express from 'express'
import upload from '../config/multer'
import { authMiddleware, uploadController } from '../di/container'


const router = express.Router()

router.route('/')  
.get(authMiddleware.verifyToken, uploadController.getUploads)
.post(authMiddleware.verifyToken, upload.single('image'), uploadController.createUpload)
.put(authMiddleware.verifyToken, upload.single('image'), uploadController.updateUpload)
.delete(authMiddleware.verifyToken, uploadController.deleteUpload)   

router.put('/reorder', authMiddleware.verifyToken, uploadController.reorderUploads)

router.get('/:id', authMiddleware.verifyToken, uploadController.getUploadWithId);      
       
   



export default router