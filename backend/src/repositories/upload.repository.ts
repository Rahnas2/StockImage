import mongoose from "mongoose";
import { Upload } from "../domain/entities/upload";
import { IUplaodRepository } from "../domain/interfaces/IUploadRepository";
import uploadModel from "../models/uploads";

export class uploadRepository implements IUplaodRepository {

    async findAll(data: Partial<Upload>): Promise<Upload[]> {
        try {
            return await uploadModel.find(data).sort({ position: -1 })
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findById(_id: string): Promise<Upload | null> {
        try {
            return await uploadModel.findById(_id)
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findByUserIdAndTitle(user: string, title: string): Promise<Upload | null> {
        try {
            return await uploadModel.findOne({
                user,
                title: { $regex: new RegExp(`^${title}$`, 'i') }
            })
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findByUserIdAndTitleAndExcludeId(user: string, title: string, _id: string): Promise<Upload | null> {
        try {
            return await uploadModel.findOne({
                _id: { $ne: _id },
                user,
                title: { $regex: new RegExp(`^${title}$`, 'i') }
            })
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async create(data: Partial<Upload>): Promise<Upload> {
        try {
            return await uploadModel.create(data)
        } catch (error) {
            throw new Error(`data base error, ${error}`)
        }
    }

    async createMany(data: Partial<Upload> []): Promise<Upload []> {
        try {
            const createdDocs =  await uploadModel.insertMany(data)
            console.log('created docs ', createdDocs)
            return createdDocs.reverse() as Upload[];
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findByIdAndUpdate(_id: string, data: Partial<Upload>): Promise<Upload | null> {
        try {
            return await uploadModel.findByIdAndUpdate(_id, data, { new: true })
        } catch (error) {
            throw new Error(`data base error, ${error}`)
        }
    }

    async findByIdAndDelete(id: string): Promise<Upload | null> {
        try {
            return await uploadModel.findByIdAndDelete(id)
        } catch (error) {
            console.log('error deleting upload ', error)
            throw new Error('data base error')
        }
    }

    async getLastPosition(user: string): Promise<number> {
        const result = await uploadModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user)
                }
            },
            {
                $group: {
                    _id: null,
                    lastPosition: { $max: "$position" }
                }
            }
        ]);

        return result[0]?.lastPosition ?? -1;
    }

}