"use client";

import React, { useEffect, useState } from "react";
import { Flame, Clock, AlertTriangle } from "lucide-react";

interface StreakWarningProps {
    lastSprintDate?: string | Date;
    currentStreak: number;
}

export default function StreakWarning({ lastSprintDate, currentStreak }: StreakWarningProps) {
    const [timeLeft, setTimeLeft] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [funnyMessage, setFunnyMessage] = useState("");

    const funnyMessages = [
        "Your streak is gasping for air! Save it! 😱",
        "The flame is flickering... Don't let it die! 🕯️",
        "Midnight is the streak reaper. Run! 🏃‍♂️",
        "Your streak is looking at you with puppy eyes. 🥺",
        "Don't let the streak spirits down today! ✨",
        "One sprint a day keeps the streak reset away! 🛡️"
    ];

    useEffect(() => {
        const checkStreak = () => {
            if (!currentStreak || currentStreak === 0) {
                setShowWarning(false);
                return;
            }

            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime();

            let lastDate = lastSprintDate ? new Date(lastSprintDate).getTime() : 0;
            const lastDateStart = new Date(new Date(lastDate).getFullYear(), new Date(lastDate).getMonth(), new Date(lastDate).getDate()).getTime();

            // If last sprint was EXACTLY yesterday, it's saveable today
            if (lastDateStart === yesterdayStart) {
                setShowWarning(true);
                if (!funnyMessage) {
                    setFunnyMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
                }
            } else {
                // Either already done today, or already lost before yesterday
                setShowWarning(false);
            }
        };

        const updateTimer = () => {
            const now = new Date();
            const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
            const diff = midnight.getTime() - now.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        checkStreak();
        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [lastSprintDate, currentStreak]);

    if (!showWarning) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative w-[320px] rounded-2xl bg-[hsl(222,25%,12%)] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl p-4 text-white">

                {/* Close Button */}
                <button
                    onClick={() => setShowWarning(false)}
                    className="absolute top-2 right-2 text-white/40 hover:text-white transition"
                >
                    ✕
                </button>

                <div className="flex items-start gap-3">

                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-400/30">
                        <Flame size={20} className="text-orange-400" />
                    </div>

                    <div className="flex-1">

                        <p className="font-bold text-sm mb-1">
                            Streak at risk 🔥
                        </p>

                        <p className="text-xs text-white/70 mb-3">
                            {funnyMessage}
                        </p>

                        <div className="flex items-center justify-between text-xs">

                            <span className="flex items-center gap-1 text-white/60">
                                <Clock size={14} /> reset in
                            </span>

                            <span className="font-mono font-semibold text-white">
                                {timeLeft}
                            </span>

                        </div>

                        {/* progress bar */}
                        <div className="mt-2 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-400 to-red-500 animate-shrink-progress"
                                style={{ width: "100%" }}
                            ></div>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
            @keyframes shrink-progress {
                from { width: 100%; }
                to { width: 0%; }
            }

            .animate-shrink-progress {
                animation: shrink-progress linear forwards;
                animation-duration: inherit;
            }
        `}</style>
        </div>
    );
}
