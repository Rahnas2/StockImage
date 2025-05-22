import { DeleteResult } from "mongoose";
import { Otp } from "../entities/Otp";

export interface IOtpRepository {
    create(data: Otp): Promise<Otp>
    findByEmail(email: string): Promise<Otp | null>
    findByEmailAndDelete(email: string): Promise<DeleteResult>
}