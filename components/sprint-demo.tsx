'use client';

import { motion } from "framer-motion";
import { Zap, Check, Star, Award } from 'lucide-react';
import { useState } from 'react';

export function SprintDemo() {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (index: number) => {
        setSelectedAnswer(index);
        setTimeout(() => setShowResult(true), 500);
    };

    return (
        <section className="relative py-32 bg-black overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [0, 100, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [0, -100, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
                    >
                        <span className="text-sm font-semibold text-white/90">INTERACTIVE DEMO</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Experience a
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Sprint in Action
                        </span>
                    </h2>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10"
                    >
                        {/* Sprint Header */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">JavaScript Fundamentals</h3>
                                    <p className="text-sm text-gray-400">Sprint 3 of 12</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-white font-semibold">+50 XP</span>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="mb-8">
                            <h4 className="text-2xl font-bold text-white mb-4">
                                What will the following code output?
                            </h4>
                            <div className="bg-black/50 rounded-xl p-6 font-mono text-green-400 mb-6">
                                <code>
                                    console.log(typeof null);
                                </code>
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-4">
                                {[
                                    { text: '"null"', correct: false },
                                    { text: '"object"', correct: true },
                                    { text: '"undefined"', correct: false },
                                    { text: '"number"', correct: false }
                                ].map((answer, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(index)}
                                        disabled={selectedAnswer !== null}
                                        className={`w-full p-5 rounded-xl text-left font-semibold transition-all ${selectedAnswer === null
                                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                            : selectedAnswer === index
                                                ? answer.correct
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                : answer.correct && showResult
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                    : 'bg-white/5 text-white/50 border border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{answer.text}</span>
                                            {selectedAnswer === index && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                >
                                                    {answer.correct ? (
                                                        <Check className="w-6 h-6" />
                                                    ) : (
                                                        <div className="w-6 h-6 text-2xl">×</div>
                                                    )}
                                                </motion.div>
                                            )}
                                            {selectedAnswer !== index && showResult && answer.correct && (
                                                <Check className="w-6 h-6" />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Result */}
                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <Award className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h5 className="text-xl font-bold text-white mb-2">Great job! +50 XP</h5>
                                        <p className="text-gray-300">
                                            In JavaScript, typeof null returns &quot;object&quot;. This is actually a legacy bug that has been kept for backward compatibility.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}