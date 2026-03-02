"use client"
import { useState } from "react"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [username, setUsername] = useState("")

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        })

        const data = await res.json()
        setMessage(data.message || "Registered successfully! Token returned in console.")
        console.log("TOKEN:", data.token)
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form className="flex flex-col gap-4 w-96" onSubmit={handleRegister}>
                <h2 className="text-2xl font-bold">Register</h2>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="p-2 border rounded" /><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="p-2 border rounded" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="p-2 border rounded" />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded">Register</button>
                {message && <p className="text-red-500">{message}</p>}
            </form>
        </div>
    )
}