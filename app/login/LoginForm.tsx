"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound, Mail, Loader2 } from "lucide-react"
import Link from "next/link"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function LoginForm() {
    const [emailOrUsername, setEmailOrUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrUsername, password }),
            })

            const data = await res.json()
            if (res.ok) {
                // Redirect on success
                window.location.href = "/dashboard"
            } else {
                setMessage(data.message || "Failed to login")
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] flex items-center justify-center relative overflow-hidden px-4">

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[hsl(217,91%,60%,0.15)] blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[hsl(199,89%,48%,0.15)] blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(217,91%,60%,0.05)] blur-[120px]" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative z-10 w-full max-w-md"
            >
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-[hsl(215,15%,45%)] hover:text-[hsl(217,91%,60%)] font-semibold transition-colors">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-2xl rounded-3xl p-8 md:p-10 shadow-[0_0_50px_hsl(217,91%,60%,0.1)]">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="text-[hsl(217,91%,60%)]" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2">Welcome Back</h2>
                        <p className="text-[hsl(215,15%,45%)] font-medium">Log in to resume your learning sprints.</p>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-2">Username or Email</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(215,15%,45%)]">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your email or username"
                                    value={emailOrUsername}
                                    onChange={e => setEmailOrUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[hsl(210,25%,98%)] border border-[hsl(210,20%,88%)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium text-[hsl(215,25%,15%)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-2">Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(215,15%,45%)]">
                                    <KeyRound size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[hsl(210,25%,98%)] border border-[hsl(210,20%,88%)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium text-[hsl(215,25%,15%)]"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 mt-2">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-[hsl(217,91%,60%)] text-white text-base py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[hsl(217,91%,55%)] transition-colors shadow-[0_0_30px_hsl(217,91%,60%,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-[hsl(215,15%,45%)]">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-[hsl(217,91%,60%)] font-bold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
