
import { User } from "../domain/entities/user";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import userModel from "../models/users";

export class userRepository implements IUserRepository {

    async create(data: User): Promise<User> {
        try {
            return await userModel.create(data)
        } catch (error) {
            throw new Error(`data base error, ${error}`)
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await userModel.findOne({email})
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            return await userModel.findById(id)
        } catch (error) {
            throw new Error('data base error')
        }
    }

    async findByIdAndUpdate(id: string, data: Partial<User>) {
        try {
            return await userModel.findByIdAndUpdate(id, data, { new: true })
        } catch (error) {
            throw new Error('data base error')
        }
    }

}