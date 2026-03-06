import { requireAuth } from "@/middleware/middleware";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import Link from "next/link";
import {
    Flame, Sparkles, Trophy, Clock, PlayCircle, Star, Target, CheckCircle2, Zap, BookOpen, Award, ArrowLeft, Lock
} from "lucide-react";
import { ACHIEVEMENTS, checkAndGrantAchievements } from "@/lib/achievements";

const IconMap: Record<string, any> = {
    Flame, Sparkles, Trophy, Clock, PlayCircle, Star, Target, CheckCircle2, Zap, BookOpen, Award
};

export default async function AchievementsPage() {
    const user = await requireAuth();
    await connectDB();

    // Ensure user has all latest rewards
    const updatedAchievements = await checkAndGrantAchievements(user, User);
    const unlockedIds = new Set(updatedAchievements.map((a: any) => a.id));

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] overflow-x-hidden pt-28 pb-24">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(217,91%,60%,0.08)] blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[hsl(199,89%,48%,0.08)] blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[hsl(215,15%,45%)] hover:text-[hsl(217,91%,60%)] font-bold mb-8 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-black text-[hsl(215,25%,15%)] mb-2 flex items-center gap-3">
                        <Trophy className="text-yellow-500" size={32} /> Your Achievements
                    </h1>
                    <p className="text-[hsl(215,15%,45%)] text-lg font-medium">
                        Total Unlocked: <span className="text-[hsl(217,91%,60%)]">{unlockedIds.size} / {ACHIEVEMENTS.length}</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ACHIEVEMENTS.map((achievement) => {
                        const isUnlocked = unlockedIds.has(achievement.id);
                        const IconComponent = IconMap[achievement.icon] || Trophy;

                        return (
                            <div
                                key={achievement.id}
                                className={`relative overflow-hidden bg-white/80 backdrop-blur-xl border-2 rounded-3xl p-8 transition-all duration-500 group ${isUnlocked
                                    ? "border-[hsl(217,91%,60%,0.2)] shadow-[0_10px_40px_-15px_hsl(217,91%,60%,0.15)] scale-100"
                                    : "border-transparent opacity-60 grayscale scale-95"
                                    }`}
                            >
                                {/* Decorative Background Circle */}
                                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-colors duration-500 ${isUnlocked ? "bg-[hsl(217,91%,60%,0.15)]" : "bg-gray-100"
                                    }`} />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${isUnlocked
                                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg rotate-0"
                                        : "bg-gray-200 text-gray-400 rotate-12"
                                        }`}>
                                        {isUnlocked ? (
                                            <IconComponent size={36} className="animate-pulse-slow" />
                                        ) : (
                                            <Lock size={36} />
                                        )}
                                    </div>

                                    <h3 className={`text-xl font-black mb-2 ${isUnlocked ? "text-[hsl(215,25%,15%)]" : "text-gray-500"}`}>
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm font-medium text-[hsl(215,15%,45%)] leading-relaxed">
                                        {achievement.description}
                                    </p>

                                    {isUnlocked && (
                                        <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={12} /> Unlocked
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
