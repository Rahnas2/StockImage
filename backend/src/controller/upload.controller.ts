import { Request, Response } from "express";
import { UploadService } from "../services/upload.service";
import { NextFunction } from "express-serve-static-core";
import { HttpStatusCode } from "../utils/statusCode";
import { AuthRequest } from "../domain/interfaces/authRequest";
import { BadRequestError } from "../utils/errors";

export class UploadController {
    constructor(private uploadService: UploadService) { }

    getUploads = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            console.log('hello ')
            const user = req.user

            const uploads = await this.uploadService.getUploads(user as string)
            res.status(HttpStatusCode.OK).json({ message: 'success', uploads })
        } catch (error) {
            next(error)
        }
    }

    getUploadWithId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _id = req.params.id

            const upload = await this.uploadService.getUploadWithId(_id)
            res.status(HttpStatusCode.OK).json({ message: 'success', upload})
        } catch (error) {
            next(error)
        }
    }

    createUpload = async (req: AuthRequest, res: Response, next: NextFunction) => {   
        try {
            const user = req.user  

            const { title } = req.body       
            const image = req.file

            if (!image || !title) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'image or title is missing' })
                return
            }

            const upload = await this.uploadService.createUpload(user as string, title, image)
            res.status(HttpStatusCode.CREATED).json({ message: 'success', upload })
        } catch (error) {
            next(error)
        }
    }

    updateUpload = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {

            const user = req.user
            const { _id, title } = req.body

            const image = req.file
            console.log('reqfile ', req.file)

            console.log('hello ', req.body)
            if(!_id){
                throw new BadRequestError('_id is required')
            }

            const upload = await this.uploadService.updateUpload(user as string, _id, title, image)

            res.status(HttpStatusCode.OK).json({message: 'success', upload})
        } catch (error) {
            next(error)
        }
    }

    deleteUpload = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id } = req.query
            const upload = await this.uploadService.deleteUpload(_id as string)
            res.status(HttpStatusCode.OK).json({ message: 'success', upload })
        } catch (error) {
            next(error)
        }
    } 

    reorderUploads = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { uploads } = req.body
            const user = req.user

            await this.uploadService.reorderUploads(user as string, uploads)

            res.status(HttpStatusCode.OK).json({message: 'success'})   
        } catch (error) {
            next(error)
        }
    }

}