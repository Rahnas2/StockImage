import { title } from "process";
import { Upload } from "../domain/entities/upload";
import { uploadRepository } from "../repositories/upload.repository";
import { CloudinaryService } from "../utils/cloudinayService";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";

export class UploadService {

    constructor(private cloudinaryService: CloudinaryService,
        private uploadRepository: uploadRepository
    ) { }

    async getUploads(user: string) {
        return await this.uploadRepository.findAll({ user })
    }

    async getUploadWithId(_id: string) {
        const upload = await this.uploadRepository.findById(_id)
        if (!upload) {
            throw new NotFoundError('_id is incorrect document not found')
        }
        return upload
    }


    async createUpload(user: string, titles: string[], files: Express.Multer.File[]) {

        const existingUploads = await Promise.all(
            titles.map(title => this.uploadRepository.findByUserIdAndTitle(user, title))
        );
        const duplicate = existingUploads.find(upload => upload !== null);

        if (duplicate) {
            const existingNames = existingUploads.filter(up => up !== null).map(up => up.title)
            const titleList = existingNames.join(', ');
            const plural = existingNames.length > 1;

            const message = plural
                ? `The titles "${titleList}" are already in use. Please enter unique titles for each image.`
                : `The title "${titleList}" is already in use. Please choose a different title.`;
                
            throw new BadRequestError(message);
        }

        const lastPosition = await this.uploadRepository.getLastPosition(user)

        const cloudinaryUploads = await Promise.all(
            files.map(file => this.cloudinaryService.uploadImage(file.buffer, 'uploads'))
        )

        const uploadsData = cloudinaryUploads.map((upload, index) => ({
            user,
            title: titles[index],
            image: upload.url,
            imagePublicId: upload.publicId,
            position: lastPosition + index + 1
        }))

        const uploads = await this.uploadRepository.createMany(uploadsData)
        return uploads

    }

    async updateUpload(user: string, _id: string, title?: string, file?: Express.Multer.File) {


        const existingUpload = await this.uploadRepository.findById(_id)
        if (!existingUpload) {
            throw new NotFoundError('upload not found')
        }

        const updateData: Partial<Upload> = {}

        if (file) {
            await this.cloudinaryService.deleteImage(existingUpload.imagePublicId)
            const { url, publicId } = await this.cloudinaryService.uploadImage(file.buffer, 'uploads')

            updateData.image = url
            updateData.imagePublicId = publicId
        }

        if (title) {
            const existingUploadByTitle = await this.uploadRepository.findByUserIdAndTitleAndExcludeId(user, title, _id)
            if (existingUploadByTitle) {
                throw new ConflictError('already in use')
            }

            updateData.title = title
        }

        console.log('update data', updateData)
        if (Object.keys(updateData).length > 0) {
            console.log('herer ')
            return await this.uploadRepository.findByIdAndUpdate(_id, updateData)
        }
    }

    async deleteUpload(_id: string) {
        const result = await this.uploadRepository.findByIdAndDelete(_id)
        if (!result) {
            throw new NotFoundError('Incorrect _id')
        }

        await this.cloudinaryService.deleteImage(result.imagePublicId)

        return result
    }

    async reorderUploads(user: string, uploads: Partial<Upload>[]) {
        if (uploads.length < 1) {
            throw new BadRequestError('Uploads array must contain at least one item.');
        }

        const positions = uploads.map(upload => upload.position);
        const uniquePositions = new Set(positions);

        if (positions.length !== uniquePositions.size) {
            throw new BadRequestError('Invalid or duplicate position values.');
        }

        const updatePromises = uploads.map(upload => {
            return this.uploadRepository.findByIdAndUpdate(upload._id as string, {
                position: upload.position
            });
        });

        await Promise.all(updatePromises);
    }
}