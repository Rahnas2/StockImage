export interface Upload {
    _id: string,
    user: string,
    title: string,
    image: string,
    imagePublicId: string,
    position?: number
}