import mongoose, { Schema, model, models } from "mongoose"

export interface IUser {
    username: string
    email: string
    password: string
    totalXP: number
    currentStreak: number
    role: "user" | "admin"
    lastSprintDate?: Date
    skills: {
        pathId: string
        level: number
        completedSprints: string[]
        xp: number
    }[]
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true }, // login + display
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalXP: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    lastSprintDate: { type: Date },
    skills: [
        {
            pathId: { type: String },
            level: { type: Number, default: 1 },
            completedSprints: { type: [String], default: [] },
            xp: { type: Number, default: 0 },
        },
    ],
}, { timestamps: true })

export const User = models.User || model<IUser>("User", userSchema)