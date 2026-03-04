'use client';

import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, Settings } from "lucide-react";

export function Header({ user }: { user: any }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { scrollY, scrollYProgress } = useScroll();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh(); // Ensure layout refetches user
    };

    // SCROLL PROGRESS BAR
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // HEADER APPEARANCE
    const navOpacity = useTransform(scrollY, [0, 10], [0, 1]);
    const navY = useTransform(scrollY, [0, 10], [-20, 0]);
    const navBackground = useTransform(scrollY, [0, 20], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']);
    const navBlur = useTransform(scrollY, [0, 20], ['blur(0px)', 'blur(12px)']);
    const navBorder = useTransform(scrollY, [0, 20], ['rgba(210,220,230,0)', 'rgba(210,220,230,0.6)']);

    const userInitial = (user?.username || user?.name || "?").charAt(0).toUpperCase();

    return (
        <>
            <motion.div
                style={{ scaleX }}
                className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] z-[60] origin-left"
            />

            <motion.nav
                style={{
                    opacity: navOpacity,
                    y: navY,
                    backgroundColor: navBackground,
                    backdropFilter: navBlur,
                    borderColor: navBorder
                }}
                className="fixed top-0 left-0 right-0 z-50 border-b shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-[hsl(215,25%,15%)] text-xl">Sprint.Io</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm text-[hsl(215,15%,45%)]">
                        <a href="#features" className="hover:text-[hsl(217,91%,60%)] transition-colors">Features</a>
                        <a href="#paths" className="hover:text-[hsl(217,91%,60%)] transition-colors">Paths</a>
                        <a href="#leaderboard" className="hover:text-[hsl(217,91%,60%)] transition-colors">Leaderboard</a>
                        <a href="#testimonials" className="hover:text-[hsl(217,91%,60%)] transition-colors">Reviews</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] flex items-center justify-center text-white font-bold shadow-md border-2 border-white"
                                >
                                    {userInitial}
                                </motion.button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-[hsl(210,20%,88%,0.6)] overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-[hsl(210,20%,88%,0.4)] bg-[hsl(210,25%,98%)]">
                                                <p className="text-xs font-semibold text-[hsl(215,15%,45%)]">Logged in as</p>
                                                <p className="text-sm font-bold text-[hsl(215,25%,15%)] truncate">{user.username || user.name}</p>
                                            </div>
                                            <div className="p-1">
                                                <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(215,25%,15%)] hover:bg-[hsl(217,91%,60%,0.08)] hover:text-[hsl(217,91%,60%)] rounded-lg transition-colors font-medium">
                                                    <LayoutDashboard size={16} />
                                                    Dashboard
                                                </Link>
                                                {user.role === 'admin' && (
                                                    <Link href="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,48%,0.08)] rounded-lg transition-colors font-bold">
                                                        <Settings size={16} />
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(215,25%,15%)] hover:bg-[hsl(217,91%,60%,0.08)] hover:text-[hsl(217,91%,60%)] rounded-lg transition-colors font-medium">
                                                    <User size={16} />
                                                    Profile
                                                </Link>
                                                <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-[hsl(215,25%,15%)] hover:bg-[hsl(217,91%,60%,0.08)] hover:text-[hsl(217,91%,60%)] rounded-lg transition-colors font-medium">
                                                    <Settings size={16} />
                                                    Settings
                                                </Link>
                                            </div>
                                            <div className="p-1 border-t border-[hsl(210,20%,88%,0.4)]">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-[0.9rem] font-semibold text-[hsl(215,15%,45%)] hover:text-[hsl(217,91%,60%)] transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-[hsl(217,91%,60%)] text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-[hsl(217,91%,55%)] transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>
        </>
    );
}