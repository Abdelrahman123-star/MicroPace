'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { Zap, Check, Star, Award, MousePointer2, Pointer } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function SprintDemo() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const [targetPos, setTargetPos] = useState({ x: "75%", y: "65%" });
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorSize, setCursorSize] = useState(90);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 60%", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Update target position and cursor size based on screen
    useEffect(() => {
        const updateLayout = () => {
            if (targetRef.current && sectionRef.current) {
                const targetRect = targetRef.current.getBoundingClientRect();
                const sectionRect = sectionRef.current.getBoundingClientRect();

                // Calculate position relative to section
                const x = ((targetRect.left + targetRect.width / 2) - sectionRect.left);
                const y = ((targetRect.top + targetRect.height / 2) - sectionRect.top);
                setTargetPos({ x: `${x}px`, y: `${y}px` });
            }

            // Scale cursor size
            if (window.innerWidth < 768) {
                setCursorSize(60);
            } else {
                setCursorSize(90);
            }
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, []);

    // Cursor movement transforms
    // From Top Right (100%, 0) to Target Position
    const cursorX = useTransform(smoothProgress, [0.1, 0.45], ["100%", targetPos.x]);
    const cursorY = useTransform(smoothProgress, [0.1, 0.45], ["0%", targetPos.y]);

    const cursorScale = useTransform(smoothProgress, [0.45, 0.5, 0.55], [1, 0.8, 1.2]);
    const cursorOpacity = useTransform(smoothProgress, [0, 0.1, 0.85, 0.95], [0, 1, 1, 0]);

    useMotionValueEvent(smoothProgress, "change", (latest) => {
        // Change logic for icon
        if (latest > 0.45) {
            setIsHovering(true);
        } else {
            setIsHovering(false);
        }

        // Selection logic
        if (latest > 0.5) {
            setSelectedAnswer(1); // "object" is index 1
        } else {
            setSelectedAnswer(null);
        }

        // Result logic
        if (latest > 0.58) {
            setShowResult(true);
        } else {
            setShowResult(false);
        }
    });

    const answers = [
        { text: '"null"', correct: false },
        { text: '"object"', correct: true },
        { text: '"undefined"', correct: false },
        { text: '"number"', correct: false }
    ];

    return (
        <section ref={sectionRef} className="relative py-20 md:py-32 bg-black overflow-hidden min-h-[140vh]">
            {/* Giant Animated Cursor */}
            <motion.div
                style={{
                    left: cursorX,
                    top: cursorY,
                    scale: cursorScale,
                    opacity: cursorOpacity,
                    position: "absolute",
                    zIndex: 100,
                    pointerEvents: "none",
                    translateX: "-20%",
                    translateY: "-40%"
                }}
                className="text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]"
            >
                {isHovering ? (
                    <Pointer size={cursorSize} fill="currentColor" className="rotate-[-35deg] text-blue-300" />
                ) : (
                    <MousePointer2 size={cursorSize} fill="currentColor" className="rotate-[-10deg]" />
                )}
            </motion.div>

            {/* Animated gradient background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl opacity-20 md:opacity-100"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                    >
                        <span className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-widest">Interactive Playground</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
                        Sprint
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic px-2 md:px-4">
                            Live
                        </span>
                    </h2>
                    <p className="text-blue-400/50 font-bold uppercase tracking-widest text-[10px] md:text-xs animate-pulse">Scroll to initiate sequence</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900/40 backdrop-blur-3xl rounded-[30px] md:rounded-[40px] p-6 md:p-14 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Sprint Header */}
                        <div className="flex items-center justify-between mb-8 md:mb-12 pb-6 md:pb-8 border-b border-white/10">
                            <div className="flex items-center gap-3 md:gap-5">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                                    <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                                <div className="max-w-[150px] md:max-w-none">
                                    <h3 className="text-lg md:text-2xl font-black text-white truncate">JS Core Concepts</h3>
                                    <p className="text-[10px] md:text-sm text-blue-400/60 font-mono">MODULE_TYPE: OBJECT_PROTOTYPES</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-black text-sm md:text-xl">+100 XP</span>
                            </div>
                        </div>

                        {/* Question Area */}
                        <div className="mb-8 md:mb-12">
                            <h4 className="text-xl md:text-3xl font-bold text-white mb-6 md:mb-8 leading-tight">
                                Identify the output of the following operation:
                            </h4>
                            <div className="bg-black/60 rounded-2xl md:rounded-3xl p-6 md:p-8 font-mono text-lg md:text-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-purple-400">console</span>.<span className="text-blue-400">log</span>(<span className="text-purple-400">typeof</span> <span className="text-amber-400">null</span>);
                            </div>

                            {/* Options Grid */}
                            <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {answers.map((answer, index) => (
                                    <div
                                        key={index}
                                        ref={index === 1 ? targetRef : null}
                                        className={`relative group cursor-default p-4 md:p-6 rounded-xl md:rounded-[24px] font-bold text-lg md:text-xl border transition-all duration-500 px-6 ${selectedAnswer === null
                                            ? 'bg-white/5 border-white/10 text-white/50'
                                            : selectedAnswer === index
                                                ? answer.correct
                                                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.2)]'
                                                    : 'bg-red-500/20 border-red-500/50 text-red-400'
                                                : answer.correct && showResult
                                                    ? 'bg-blue-500/10 border-blue-400/20 text-blue-400/60'
                                                    : 'bg-white/5 border-white/5 text-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="relative z-10">{answer.text}</span>
                                            {selectedAnswer === index && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    key={`icon-${index}`}
                                                    className="relative z-10"
                                                >
                                                    {answer.correct ? (
                                                        <div className="bg-blue-500 rounded-full p-1.5 md:p-2">
                                                            <Check className="w-4 h-4 md:w-6 md:h-6 text-white" strokeWidth={4} />
                                                        </div>
                                                    ) : (
                                                        <div className="text-red-500 text-2xl md:text-3xl">×</div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Results Terminal */}
                        <div className="min-h-[140px] md:min-h-[160px]">
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl md:rounded-[32px] p-6 md:p-8 border border-blue-500/30 backdrop-blur-xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 hidden md:block">
                                        <Award className="w-12 h-12 text-blue-400/20" />
                                    </div>
                                    <div className="flex items-start gap-4 md:gap-6 relative z-10">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 animate-bounce shadow-2xl shadow-blue-500/50">
                                            <Star className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
                                        </div>
                                        <div>
                                            <h5 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2 uppercase italic tracking-tighter">Mission Complete</h5>
                                            <p className="text-blue-100/70 text-sm md:text-lg font-medium leading-relaxed">
                                                In JS, <code className="text-blue-400 px-1.5 bg-blue-500/10 rounded">typeof null</code> returns <span className="text-amber-400">&quot;object&quot;</span>.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

