import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        await connectDB()
        const { emailOrUsername, password } = await req.json()

        if (!emailOrUsername || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 })
        }

        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        })

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
        }

        const token = signToken({ id: user._id, username: user.username, email: user.email })

        const response = NextResponse.json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email },
        })

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