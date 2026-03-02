import { requireAuth } from "@/middleware/middleware"
import LogoutButton from "@/components/LogoutButton"

export default async function DashboardPage() {
    const user = await requireAuth() // reusable auth check

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-xl">Welcome, {user.username}!</p>
            <LogoutButton />
        </div>
    )
}