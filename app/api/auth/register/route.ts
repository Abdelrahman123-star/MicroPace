import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        await connectDB()
        const body = await req.json()
        const { username, email, password } = body

        if (!username || !email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 })
        }

        // Check if user Email exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        })
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        // Generate JWT
        const token = signToken({ id: newUser._id, username: newUser.username, email: newUser.email })


        const response = NextResponse.json({
            message: "Registered successfully",
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
        })
        // Set JWT cookie (HTTP-only)
        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        return response

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}