export interface Otp {
    email: string,
    otp: string,
    createdAt?: Date,
    expireAt: Date
}