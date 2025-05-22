import { NextFunction, Response } from "express";
import { UnauthorizedError } from "../utils/errors";
import { Token } from "../utils/token";
import { AuthRequest } from "../domain/interfaces/authRequest";

export class AuthMiddleware {
    constructor(private token: Token) {}
    verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authorization = req.header("Authorization");

            if (!authorization || !authorization.startsWith('Bearer')) {
                throw new UnauthorizedError('Unauthorized')
            }

            const accessToken = authorization.split(" ")[1]

            if (!accessToken) {
                throw new UnauthorizedError('Unauthorized')
            }

            const payload = this.token.verifyAccessToken(accessToken)

            req.user = payload.userId
            req.email = payload.email

            console.log('token verified')
            next()
        } catch (error) {
            next(error)
        }
    }
}
