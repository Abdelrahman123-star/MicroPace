"use client";

import Link from "next/link";
import { CheckCircle2, Trophy, Clock } from "lucide-react";

interface SprintListItemProps {
    sprint: any;
    index: number;
    isCompleted: boolean;
    slug: string;
}

export default function SprintListItem({ sprint, index, isCompleted, slug }: SprintListItemProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (isCompleted) {
            const proceed = confirm(
                "You have already completed this sprint. Replaying it will not grant you any extra XP or Streak. Do you want to continue?"
            );
            if (!proceed) e.preventDefault();
        }
    };

    return (
        <Link
            href={`/paths/${slug}/${sprint.slug}`}
            onClick={handleClick}
            className={`group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden
                ${isCompleted
                    ? "bg-white/40 border-[hsl(210,20%,88%,0.5)] hover:bg-white/60"
                    : "bg-white hover:border-[hsl(217,91%,60%,0.5)] hover:shadow-[0_8px_30px_hsl(217,91%,60%,0.1)] border-[hsl(210,20%,88%)]"
                }`}
        >
            <div className="flex items-center gap-5">
                {isCompleted ? (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="text-green-500" size={24} />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-[hsl(210,25%,96%)] flex items-center justify-center group-hover:bg-[hsl(217,91%,60%)] transition-colors flex-shrink-0">
                        <span className="font-black text-[hsl(215,15%,45%)] group-hover:text-white transition-colors">
                            {index + 1}
                        </span>
                    </div>
                )}

                <div>
                    <h3 className={`text-xl font-bold mb-1 transition-colors ${isCompleted ? "text-[hsl(215,15%,45%)]" : "text-[hsl(215,25%,15%)] group-hover:text-[hsl(217,91%,60%)]"}`}>
                        {sprint.title || `Sprint ${index + 1}`}
                    </h3>
                    <div className="flex items-center gap-4 text-sm font-semibold">
                        <span className="flex items-center gap-1 text-[hsl(217,91%,60%)]">
                            <Trophy size={14} /> {sprint.xpReward || 10} XP
                        </span>
                        <span className="flex items-center gap-1 text-[hsl(215,15%,45%)]">
                            <Clock size={14} /> ~5 min
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                <div className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors border ${isCompleted
                        ? "bg-transparent text-[hsl(215,15%,45%)] border-[hsl(210,20%,88%)] group-hover:bg-white"
                        : "bg-[hsl(210,25%,98%)] text-[hsl(215,25%,15%)] border-[hsl(210,20%,88%)] group-hover:bg-[hsl(217,91%,60%)] group-hover:text-white group-hover:border-[hsl(217,91%,60%)]"
                    }`}>
                    {isCompleted ? "Replay Sprint" : "Start Sprint"}
                </div>
            </div>
        </Link>
    );
}
