import mongoose, { Schema, model, models } from "mongoose"

export interface IPath {
    name: string
    slug: string
    description: string
    icon?: string
    category: string
}

const pathSchema = new Schema<IPath>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        icon: { type: String },
        category: { type: String, default: "General" },
    },
    { timestamps: true }
)

export const Path = models.Path || model<IPath>("Path", pathSchema)