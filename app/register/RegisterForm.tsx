"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound, Mail, User, Loader2 } from "lucide-react"
import Link from "next/link"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function RegisterForm() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState({ text: "", type: "" })
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: "", type: "" })

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            })

            const data = await res.json()
            if (res.ok) {
                setMessage({ text: "Registration successful! Redirecting...", type: "success" })
                // Delay for a visual cue then redirect
                setTimeout(() => window.location.href = "/dashboard", 1500)
            } else {
                setMessage({ text: data.message || "Registration failed", type: "error" })
            }
        } catch (error) {
            setMessage({ text: "An error occurred. Please try again.", type: "error" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] flex items-center justify-center relative overflow-hidden px-4 py-8">

            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[hsl(199,89%,48%,0.15)] blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[hsl(217,91%,60%,0.15)] blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(217,91%,60%,0.05)] blur-[120px]" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative z-10 w-full max-w-md"
            >
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-[hsl(215,15%,45%)] hover:text-[hsl(217,91%,60%)] font-semibold transition-colors">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                </div>

                <div className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-2xl rounded-3xl p-8 md:p-10 shadow-[0_0_50px_hsl(199,89%,48%,0.1)]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-[hsl(199,89%,48%,0.1)] flex items-center justify-center mx-auto mb-4">
                            <User className="text-[hsl(199,89%,48%)]" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2">Create Account</h2>
                        <p className="text-[hsl(215,15%,45%)] font-medium">Join Sprint.Io and elevate your skills.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-2">Username</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(215,15%,45%)]">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    required
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[hsl(210,25%,98%)] border border-[hsl(210,20%,88%)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium text-[hsl(215,25%,15%)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-2">Email</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(215,15%,45%)]">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
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
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[hsl(210,25%,98%)] border border-[hsl(210,20%,88%)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium text-[hsl(215,25%,15%)]"
                                />
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-3 rounded-xl text-sm font-semibold border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'} mt-2`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-[hsl(215,25%,15%)] text-white text-base py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-[hsl(215,15%,45%)]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[hsl(217,91%,60%)] font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
