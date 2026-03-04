'use client';
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";


import {
    Sparkles, Shield, BarChart3, Globe,
} from "lucide-react";




import { skillPaths } from "@/lib/constants";

export function SkillPath() {
    // ─── Horizontal Scroll Component with Smooth Animation ───
    function HorizontalScroll({ children }: { children: React.ReactNode }) {
        const containerRef = useRef<HTMLDivElement>(null);
        const { scrollYProgress } = useScroll({
            target: containerRef,
            offset: ["start end", "end start"],
        });

        // Use a spring animation for smoother movement
        const smoothProgress = useSpring(scrollYProgress, {
            stiffness: 80,    // Lower = smoother but slower
            damping: 25,      // Higher = less bounce
            mass: 0.8,        // Lower = faster response
            restDelta: 0.001  // When to stop animating
        });

        const x = useTransform(smoothProgress, [0, 1], ["10%", "-30%"]);

        return (
            <div ref={containerRef} className="overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="flex gap-6 py-8"
                >
                    {children}
                </motion.div>
            </div>
        );
    }

    return (
        // {/* ─── SKILL PATHS (Choose Your Path) ─── */}

        <section id="paths" className="relative z-10 py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <p className="text-xs uppercase tracking-[0.3em] text-[hsl(217,91%,60%)] font-bold mb-4">Learning Tracks</p>
                    <h2 className="text-5xl md:text-6xl font-bold text-[hsl(215,25%,15%)]">
                        Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] font-extrabold">Path</span>
                    </h2>
                </div>
            </div>

            <HorizontalScroll>
                {[...skillPaths, ...skillPaths].map((path, i) => (
                    <motion.div
                        key={`${path.name}-${i}`}
                        whileHover={{ y: -10, scale: 1.03 }}
                        className="min-w-[320px] bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] shadow-lg rounded-3xl p-8 shadow-[inset_0_0_0_1px_hsl(217,91%,60%,0.15)] cursor-pointer group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <path.icon className="text-[hsl(217,91%,60%)]" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[hsl(215,25%,15%)] mb-2">{path.name}</h3>
                        <p className="text-sm text-[hsl(215,15%,45%)] mb-1 font-semibold">{path.modules} Modules</p>
                        <div className="mt-6">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-[hsl(215,15%,45%)] font-semibold">Progress</span>
                                <span className="text-[hsl(217,91%,60%)] font-extrabold">{path.progress}%</span>
                            </div>
                            <div className="h-2 bg-[hsl(210,20%,90%)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${path.progress}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.3 + (i % 4) * 0.15, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </HorizontalScroll>
        </section>

    );
}