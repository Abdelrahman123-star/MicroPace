import mongoose, { Schema, model, models } from "mongoose"

export interface IQuestion {
    type: "mcq" | "fill_in_blanks" | "ordering"
    question: string
    options?: string[] // For MCQ
    correctAnswerIndex?: number // For MCQ
    blanks?: string[] // For Fill-in-blanks
    draggables?: string[] // For Fill-in-blanks
    itemsToOrder?: string[] // For Ordering
}

export interface ISprint {
    pathId: mongoose.Types.ObjectId
    title: string
    slug: string
    lessonContent: string
    codeSnippet?: string
    codeLanguage?: string
    questions: IQuestion[]
    xpReward: number
    order: number
}

const questionSchema = new Schema<IQuestion>({
    type: { type: String, enum: ["mcq", "fill_in_blanks", "ordering"], required: true },
    question: { type: String, required: true },
    options: { type: [String] },
    correctAnswerIndex: { type: Number },
    blanks: { type: [String] },
    draggables: { type: [String] },
    itemsToOrder: { type: [String] },
})

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
        codeSnippet: { type: String },
        codeLanguage: { type: String },
        questions: { type: [questionSchema], required: true },
        xpReward: { type: Number, default: 10 },
        order: { type: Number, required: true },
    },
    { timestamps: true }
)

export const Sprint = models.Sprint || model<ISprint>("Sprint", sprintSchema)