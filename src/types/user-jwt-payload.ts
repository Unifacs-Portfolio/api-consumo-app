import type { JwtPayload } from 'jsonwebtoken'

export interface UserJwtPayload extends JwtPayload {
    userId: string
    email: string
}
