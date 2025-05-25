import { NextFunction, Response, Request } from "express"

import { BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, InternalServerError, NotFoundError } from "../utils/errors"
import { HttpStatusCode } from "../utils/statusCode"
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('error --> ', err)
    if (err instanceof NotFoundError) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: err.message })
        return
    }

    if (err instanceof BadRequestError) {
        console.log('came herer...',)
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message })
        return
    }

    if (err instanceof ConflictError) {
        res.status(HttpStatusCode.CONFLICT).json({ message: err.message })
        return
    }

    if (err instanceof UnauthorizedError) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ message: err.message })
        return
    }

    if (err instanceof ForbiddenError) {
        res.status(HttpStatusCode.FORBIDDEN).json({ message: err.message })
        return
    }
    else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: err.message || 'Internal Server Error'
        })
    }

}