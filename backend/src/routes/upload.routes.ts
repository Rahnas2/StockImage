import express from 'express'
import upload from '../config/multer'
import { authMiddleware, uploadController } from '../di/container'


const router = express.Router()

router.route('/')  
.get(authMiddleware.verifyToken, uploadController.getUploads)
.post(authMiddleware.verifyToken, upload.single('image'), uploadController.createUpload)
.put(authMiddleware.verifyToken, upload.single('image'), uploadController.updateUpload)
.delete(authMiddleware.verifyToken, uploadController.deleteUpload)   


router.get('/:id', authMiddleware.verifyToken, uploadController.getUploadWithId);      
       

// router.patch('/:id');    
// router.delete('/:id');    

// router.put('/reorder')

export default router