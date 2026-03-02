import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "../lib/auth"
import { connectDB } from "../lib/mongodb"
import { User } from "@/models/User"

export async function requireAuth() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) redirect("/")

    let payload: any
    try {
        payload = verifyToken(token)
    } catch (err) {
        redirect("/")
    }

    await connectDB()
    const user = await User.findById(payload.id).select("-password")
    if (!user) redirect("/")

    return user
}