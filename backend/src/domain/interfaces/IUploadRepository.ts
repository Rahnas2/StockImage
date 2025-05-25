import mongoose from "mongoose";
import { Upload } from "../entities/upload";

export interface IUplaodRepository {
    create(data: Partial<Upload>): Promise<Upload>
    findAll(data: Partial<Upload>): Promise<Upload []>
    findById(_id: string): Promise<Upload | null>
    findByUserIdAndTitle(user: string, title: string): Promise<Upload | null>
    findByUserIdAndTitleAndExcludeId(user: string, title: string, _id: string): Promise<Upload | null>

    findByIdAndUpdate(_id: string, data: Partial<Upload>): Promise<Upload | null>
    findByIdAndDelete(_id: string): Promise<Upload | null>

    getLastPosition(user: string): Promise<number>
}