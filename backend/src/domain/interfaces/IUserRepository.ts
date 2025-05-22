import { User } from "../entities/user";

export interface IUserRepository {
    create(data: Partial<User>): Promise<User>
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findByIdAndUpdate(id: string, data: Partial<User>): Promise<User | null>
}