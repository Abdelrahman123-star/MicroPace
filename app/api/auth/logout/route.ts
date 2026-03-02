import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" })

    // Clear the JWT cookie
    response.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0, // immediately expires
    })

    return response
}