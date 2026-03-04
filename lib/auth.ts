import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

// 7d for testing change later
export function signToken(payload: object, expiresIn: string | number = "7d") {
    // Cast options to any to bypass strict overloaded definitions if needed
    // The issue is usually that string is not strictly typed to StringValue in the @types def
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any })
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET)
}