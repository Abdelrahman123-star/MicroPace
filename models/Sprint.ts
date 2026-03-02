import mongoose, { Schema, model, models } from "mongoose"

export interface ISprint {
    pathId: mongoose.Types.ObjectId
    title: string
    slug: string
    lessonContent: string
    mcqQuestion: string
    mcqOptions: string[]
    correctAnswerIndex: number
    xpReward: number
    order: number
}

const sprintSchema = new Schema<ISprint>(
    {
        pathId: {
            type: Schema.Types.ObjectId,
            ref: "Path",
            required: true,
        },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        lessonContent: { type: String, required: true },
        mcqQuestion: { type: String, required: true },
        mcqOptions: { type: [String], required: true },
        correctAnswerIndex: { type: Number, required: true },
        xpReward: { type: Number, default: 10 },
        order: { type: Number, required: true },
    },
    { timestamps: true }
)

export const Sprint = models.Sprint || model<ISprint>("Sprint", sprintSchema)