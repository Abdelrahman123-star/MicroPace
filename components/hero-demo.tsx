'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Sparkles, Code2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

const lessons = [
    {
        name: "Shape Fusion",
        code: `.shape-fusion {\n  width: 140px;\n  height: 140px;\n  background: linear-gradient(135deg, #ff6b6b, #f093fb);\n  animation: morphShape 5s infinite alternate;\n}`,
        previewClass: "shape-fusion-demo"
    },
    {
        name: "Neon Pulse",
        code: `.neon-pulse {\n  background: #000;\n  border: 2px solid #00f3ff;\n  box-shadow: 0 0 30px #00f3ff;\n  animation: neonGlow 2s infinite ease-in-out;\n}`,
        previewClass: "neon-pulse-demo"
    },
    {
        name: "Glass Bloom",
        code: `.glass-bloom {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(20px);\n  animation: glassFloat 4s infinite ease-in-out;\n  border-radius: 24px;\n}`,
        previewClass: "glass-bloom-demo"
    }
];

export function HeroDemo() {
    const [currentCode, setCurrentCode] = useState("");
    const [lessonIndex, setLessonIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(50);

    const currentLesson = lessons[lessonIndex];

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const handleTyping = () => {
            const fullCode = currentLesson.code;

            if (!isDeleting) {
                // Typing
                setCurrentCode(fullCode.substring(0, currentCode.length + 1));
                setTypingSpeed(30);

                if (currentCode === fullCode) {
                    timer = setTimeout(() => setIsDeleting(true), 4000); // 4s pause
                } else {
                    timer = setTimeout(handleTyping, typingSpeed);
                }
            } else {
                // Deleting
                setCurrentCode(fullCode.substring(0, currentCode.length - 1));
                setTypingSpeed(8); // Very fast delete

                if (currentCode === "") {
                    setIsDeleting(false);
                    setLessonIndex((prev) => (prev + 1) % lessons.length);
                    timer = setTimeout(handleTyping, 500);
                } else {
                    timer = setTimeout(handleTyping, typingSpeed);
                }
            }
        };

        timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [currentCode, isDeleting, lessonIndex]);

    // Syntax highlighting logic
    const highlightedCode = useMemo(() => {
        return currentCode
            .split('\n')
            .map((line, i) => {
                const parts = line.split(/([:;{}])/);
                return (
                    <div key={i} className="flex whitespace-pre">
                        <span className="text-white/20 w-5 select-none text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                        {parts.map((part, pi) => {
                            if (part === '{' || part === '}') return <span key={pi} className="text-pink-400 font-bold">{part}</span>;
                            if (part === ':') return <span key={pi} className="text-blue-300">{part}</span>;
                            if (part === ';') return <span key={pi} className="text-purple-300">{part}</span>;
                            if (part.includes('.')) return <span key={pi} className="text-emerald-300 font-bold">{part}</span>;
                            if (part.trim().startsWith('#') || part.trim().includes('rgba') || part.trim().includes('linear-gradient')) return <span key={pi} className="text-orange-300">{part}</span>;
                            return <span key={pi} className="text-white/80">{part}</span>;
                        })}
                    </div>
                );
            });
    }, [currentCode]);

    return (
        <div className="relative w-full max-w-2xl mx-auto perspective-2000">
            <style>{`
        @keyframes morphShape {
          0% { border-radius: 0%; transform: rotate(0deg); }
          25% { border-radius: 20% 50% 50% 20%; transform: rotate(10deg); }
          50% { border-radius: 50%; transform: rotate(180deg); }
          75% { border-radius: 50% 20% 20% 50%; transform: rotate(270deg); }
          100% { border-radius: 0%; transform: rotate(360deg); }
        }
        @keyframes neonGlow {
          0% { box-shadow: 0 0 20px #00f3ff, inset 0 0 10px #00f3ff; transform: scale(1); }
          50% { box-shadow: 0 0 50px #00f3ff, inset 0 0 30px #00f3ff; transform: scale(1.05); }
          100% { box-shadow: 0 0 20px #00f3ff, inset 0 0 10px #00f3ff; transform: scale(1); }
        }
        @keyframes glassFloat {
          0% { transform: translateY(0) rotate(0deg); border-color: rgba(255, 255, 255, 0.2); }
          50% { transform: translateY(-15px) rotate(5deg); border-color: rgba(255, 255, 255, 0.5); }
          100% { transform: translateY(0) rotate(0deg); border-color: rgba(255, 255, 255, 0.2); }
        }
        .shape-fusion-demo {
          width: 140px;
          height: 140px;
          background: linear-gradient(135deg, #ff6b6b, #f093fb);
          border-radius: 0%;
          animation: morphShape 5s infinite alternate;
          box-shadow: 0 20px 40px rgba(255, 107, 107, 0.4);
        }
        .neon-pulse-demo {
          width: 140px;
          height: 140px;
          background: #000;
          border: 3px solid #00f3ff;
          box-shadow: 0 0 30px #00f3ff, inset 0 0 20px #00f3ff;
          border-radius: 50%;
          animation: neonGlow 2s infinite ease-in-out;
        }
        .glass-bloom-demo {
          width: 140px;
          height: 140px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          position: relative;
          animation: glassFloat 4s infinite ease-in-out;
        }
        .glass-bloom-demo::after {
          content: '';
          position: absolute;
          inset: 10px;
          border-radius: 24px;
          border: 1px dashed rgba(255, 255, 255, 0.4);
        }
      `}</style>

            {/* Deep Dark Premium Container */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative bg-[#0a0a0b] rounded-[48px] p-6 md:p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden flex flex-col gap-8 ring-1 ring-white/10"
            >
                {/* Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute -top-40 -right-40 w-80 h-70 bg-blue-500   rounded-full blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 w-80 h-70 bg-purple-400 rounded-full blur-[120px]" />

                {/* Editor Area (Top) */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Terminal size={14} className="text-blue-400" />
                            </div>
                            <span className="text-xs font-bold text-white/90">style.css</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                            <div className="w-2 h-2 rounded-full bg-white/10" />
                        </div>
                    </div>

                    <div className="bg-black/60 rounded-[32px] p-6 font-mono text-xs md:text-sm leading-relaxed border border-white/5 relative shadow-inner min-h-[160px]">
                        <div className="relative z-10">
                            {highlightedCode}
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-[6px] h-[16px] md:h-[18px] bg-blue-500 ml-1 translate-y-[3px] rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Area (Bottom) */}
                <div className="w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-8 min-h-[220px] flex items-center justify-center relative overflow-hidden">
                    {/* Subtle grid background for the preview area */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:24px_24px]" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={lessonIndex}
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.1, opacity: 0, y: -20 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="relative z-20"
                        >
                            <div className={currentCode.length > 20 ? currentLesson.previewClass : "w-[140px] h-[140px] rounded-3xl bg-white/5 flex items-center justify-center border border-dashed border-white/10"}>
                                {!currentCode.length && (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                                        <Sparkles className="w-6 h-6 text-white/20" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Minimal Label */}

                </div>
            </motion.div>


        </div>
    );
}
