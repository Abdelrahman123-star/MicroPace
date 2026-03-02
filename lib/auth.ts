import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

// 7d for testing change later
export function signToken(payload: object, expiresIn = "7d") {
    return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET)
}