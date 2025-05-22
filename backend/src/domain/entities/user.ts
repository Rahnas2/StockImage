export interface User {
    _id: string,
    name: string,
    email: string,
    mobile: string,
    password: string,
    image?: string,
    imagePublicId?: string,
    isVerified: boolean,
}