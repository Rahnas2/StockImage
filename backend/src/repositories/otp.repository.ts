import { DeleteResult } from "mongoose";
import { Otp } from "../domain/entities/Otp";
import { IOtpRepository } from "../domain/interfaces/IOtpRepository";
import otpModel from "../models/otps";

export class otpRepository implements IOtpRepository {
    async create(data: Otp): Promise<Otp> {
        try {
            return await otpModel.create(data)
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findByEmail(email: string): Promise<Otp | null> {
        try {
            return await otpModel.findOne({email})
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findByEmailAndDelete(email: string): Promise<DeleteResult> {
        try {
            return await otpModel.deleteOne({email})
        } catch (error) {
            throw new Error('data base error')
        }
    }
}