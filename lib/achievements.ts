import { Trophy, Flame, Zap, Star, Target, BookOpen, Award, CheckCircle2 } from "lucide-react";

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // Lucide icon name or a component reference if we were in a TSX
    category: "milestone" | "streak" | "consistency" | "mastery";
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "first_sprint",
        title: "First Sprint Completed",
        description: "The journey of a thousand miles begins with a single step.",
        icon: "CheckCircle2",
        category: "milestone",
    },
    {
        id: "streak_3_days",
        title: "3-Day Streak!",
        description: "Consistency is key. Keep it up!",
        icon: "Flame",
        category: "streak",
    },
    {
        id: "streak_7_days",
        title: "Weekly Warrior",
        description: "A full week of learning. Impressive!",
        icon: "Flame",
        category: "streak",
    },
    {
        id: "level_5",
        title: "Rising Star",
        description: "Reach level 5 in any path.",
        icon: "Star",
        category: "mastery",
    },
    {
        id: "total_1000_xp",
        title: "XP Collector",
        description: "Earn a total of 1,000 XP.",
        icon: "Zap",
        category: "milestone",
    },
    {
        id: "path_complete",
        title: "Path Mastery",
        description: "Finish all sprints in a single path.",
        icon: "Trophy",
        category: "mastery",
    },
];


export const getAchievementById = (id: string) => ACHIEVEMENTS.find(a => a.id === id);

/**
 * Checks etc. and grants achievements to a user if conditions are met.
 * This is called from the dashboard to ensure users get rewards retrospectively.
 */
export const checkAndGrantAchievements = async (user: any, UserCollection: any) => {
    const unlockedIds = new Set((user.achievements || []).map((a: any) => a.id));
    const newAchievements: { id: string, unlockedAt: Date }[] = [];

    // 1. First Sprint Completed
    if (!unlockedIds.has("first_sprint")) {
        const hasCompletedSprint = (user.skills || []).some((s: any) => s.completedSprints?.length > 0);
        if (hasCompletedSprint) {
            newAchievements.push({ id: "first_sprint", unlockedAt: new Date() });
            unlockedIds.add("first_sprint");
        }
    }

    // 2. 3-Day Streak
    if (!unlockedIds.has("streak_3_days") && user.currentStreak >= 3) {
        newAchievements.push({ id: "streak_3_days", unlockedAt: new Date() });
        unlockedIds.add("streak_3_days");
    }

    // 3. Weekly Warrior (7-Day Streak)
    if (!unlockedIds.has("streak_7_days") && user.currentStreak >= 7) {
        newAchievements.push({ id: "streak_7_days", unlockedAt: new Date() });
        unlockedIds.add("streak_7_days");
    }

    // 4. Rising Star (Level 5)
    if (!unlockedIds.has("level_5")) {
        const hasLevel5 = (user.skills || []).some((s: any) => s.level >= 5);
        if (hasLevel5) {
            newAchievements.push({ id: "level_5", unlockedAt: new Date() });
            unlockedIds.add("level_5");
        }
    }

    // 5. XP Collector (1000 XP)
    if (!unlockedIds.has("total_1000_xp") && user.totalXP >= 1000) {
        newAchievements.push({ id: "total_1000_xp", unlockedAt: new Date() });
        unlockedIds.add("total_1000_xp");
    }

    // Update DB if any new achievements were found
    if (newAchievements.length > 0) {
        await UserCollection.findByIdAndUpdate(user._id, {
            $push: { achievements: { $each: newAchievements } }
        });

        // Return updated achievements to avoid another DB fetch in the UI
        return [...(user.achievements || []), ...newAchievements];
    }

    return user.achievements || [];
};
