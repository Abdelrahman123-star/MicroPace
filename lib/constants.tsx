import { Zap, Flame, Trophy, Target, Globe, BarChart3, Shield, Sparkles } from "lucide-react";

export const features = [
    { icon: Zap, title: "XP System", desc: "Earn experience points for every lesson, quiz, and challenge you complete.", xp: "+250 XP" },
    { icon: Flame, title: "Daily Streaks", desc: "Keep your streak alive with consistent daily learning. Don't break the chain.", streak: "🔥 47 days" },
    { icon: Trophy, title: "Rewards & Badges", desc: "Unlock exclusive badges and climb the leaderboard as you master new skills.", badge: "⭐ Elite" },
    { icon: Target, title: "Skill Paths", desc: "Follow curated learning paths designed by experts to master any subject.", progress: 78 },
];

export const testimonials = [
    {
        name: "Alex Chen",
        role: "Software Engineer",
        text: "This platform turned my random studying into a structured journey. 200-day streak and counting! The gamification is genuinely addictive.",
        xp: "45,200 XP",
        avatar: "AC"
    },
    {
        name: "Sarah Kim",
        role: "Product Designer",
        text: "The Sprint feature is addictive in the best way. I've never been this consistent with learning. It's transformed my career.",
        xp: "32,800 XP",
        avatar: "SK"
    },
    {
        name: "Marcus Rivera",
        role: "Data Scientist",
        text: "Leaderboard competition with friends keeps me going. Best investment in myself I've ever made.",
        xp: "28,400 XP",
        avatar: "MR"
    },
    {
        name: "Priya Sharma",
        role: "UX Researcher",
        text: "The skill paths are brilliantly designed. Each lesson builds on the last perfectly. I've gone from beginner to advanced in months.",
        xp: "38,100 XP",
        avatar: "PS"
    },
];

export const stats = [
    { value: "2M+", label: "Active Learners" },
    { value: "500K+", label: "Sprints Completed" },
    { value: "98%", label: "Completion Rate" },
    { value: "4.9★", label: "User Rating" },
];

export const leaderboard = [
    { rank: 1, name: "NovaCoder", xp: "52,340", streak: 186 },
    { rank: 2, name: "PixelMind", xp: "48,920", streak: 142 },
    { rank: 3, name: "ZenLearner", xp: "45,200", streak: 127 },
    { rank: 4, name: "ByteQuest", xp: "41,800", streak: 98 },
    { rank: 5, name: "SkillForge", xp: "38,500", streak: 89 },
];

export const skillPaths = [
    { name: "Frontend Mastery", progress: 82, modules: 24, icon: Globe },
    { name: "Data Science", progress: 65, modules: 32, icon: BarChart3 },
    { name: "System Design", progress: 43, modules: 18, icon: Shield },
    { name: "Database Design", progress: 28, modules: 28, icon: Sparkles },
];
