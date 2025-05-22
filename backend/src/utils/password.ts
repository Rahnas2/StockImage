import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const Bcrypt = {
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS)
    },    

    async compare(plainText: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plainText, hash)
    }
}