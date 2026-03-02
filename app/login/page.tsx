"use client"
import { useState } from "react"

export default function LoginPage() {
    const [emailOrUsername, setEmailOrUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrUsername, password }),
        })

        const data = await res.json()
        if (res.ok) {
            setMessage("Login successful! Token returned in console.")
            console.log("TOKEN:", data.token)
        } else {
            setMessage(data.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form className="flex flex-col gap-4 w-96" onSubmit={handleLogin}>
                <h2 className="text-2xl font-bold">Login</h2>
                <input type="text" placeholder="Email or Username" value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} className="p-2 border rounded" />                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="p-2 border rounded" />
                <button type="submit" className="p-2 bg-green-500 text-white rounded">Login</button>
                {message && <p className="text-red-500">{message}</p>}
            </form>
        </div>
    )
}