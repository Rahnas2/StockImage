
import jwt from 'jsonwebtoken'

import { TokenPayload } from '../domain/interfaces/TokenPayload'
import { UnauthorizedError } from './errors'

export class Token{
    private ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
    private REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
    private TOKEN_SECRET = process.env.TOKEN_SECRET as string

    generateToken(userId: string) {
        return jwt.sign({userId}, this.TOKEN_SECRET, {expiresIn: '5h'})
    }

    genereteAccessToken(payload: TokenPayload) {
        return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    }

    generateRefreshToken(payload: object) {
        return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    }

    verifyToken(token: string) {
        try {  
            return jwt.verify(token, this.TOKEN_SECRET)
        } catch (error) {
            throw new UnauthorizedError('invalid or expired token')
        }
    }

    verifyAccessToken(accessToken: string): TokenPayload {
        try {
            return jwt.verify(accessToken, this.ACCESS_TOKEN_SECRET) as TokenPayload
        } catch (error) {
            throw new UnauthorizedError('invalid or expired token')
        }
    }

    verifyRefreshToken(refreshToken: string): TokenPayload {
        try {
            return jwt.verify(refreshToken, this.ACCESS_TOKEN_SECRET) as TokenPayload
        } catch (error) {
            throw new UnauthorizedError('invalid or expired token')
        }
    }

    decodeToken(token: string) {
        return jwt.decode(token)
    }

}