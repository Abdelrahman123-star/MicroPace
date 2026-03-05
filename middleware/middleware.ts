import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "../lib/auth"
import { connectDB } from "../lib/mongodb"
import { User } from "@/models/User"

export async function requireAuth() {
    const user = await getAuthUser()
    if (!user) redirect("/login")
    return user
}

export async function getAuthUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return null

    let payload: any
    try {
        payload = verifyToken(token)
    } catch (err) {
        return null
    }

    await connectDB()
    try {
        const user = await User.findById(payload.id).select("-password")
        return user || null
    } catch (err) {
        return null
    }
}