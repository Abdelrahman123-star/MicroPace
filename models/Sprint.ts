import mongoose, { Schema, model, models } from "mongoose"



export interface ICodeChallenge {
    instructions?: string
    initialHtml?: string
    initialCss?: string
    initialJs?: string
    solutionHtml?: string
    solutionCss?: string
    solutionJs?: string
    hint?: string
}

export interface IQuestion {
    type: "mcq" | "fill_in_blanks" | "ordering" | "replica"
    question: string
    options?: string[] // For MCQ
    correctAnswerIndex?: number // For MCQ
    blanks?: string[] // For Fill-in-blanks
    draggables?: string[] // For Fill-in-blanks
    itemsToOrder?: string[] // For Ordering
    // For Replica Challenges
    initialHtml?: string
    initialCss?: string
    initialJs?: string
    solutionHtml?: string
    solutionCss?: string
    solutionJs?: string
    replicaHtml?: string
    replicaCss?: string
    replicaJs?: string
    hint?: string
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
    // Optional story-driven fields for narrative learning
    storyContext?: string
    completionStory?: string
    characters?: string[]
    codeChallenge?: ICodeChallenge
    showCodePreview?: boolean
}

const questionSchema = new Schema<IQuestion>({
    type: { type: String, enum: ["mcq", "fill_in_blanks", "ordering", "replica"], required: true },
    question: { type: String, required: true },
    options: { type: [String] },
    correctAnswerIndex: { type: Number },
    blanks: { type: [String] },
    draggables: { type: [String] },
    itemsToOrder: { type: [String] },
    initialHtml: { type: String },
    initialCss: { type: String },
    initialJs: { type: String },
    solutionHtml: { type: String },
    solutionCss: { type: String },
    solutionJs: { type: String },
    replicaHtml: { type: String },
    replicaCss: { type: String },
    replicaJs: { type: String },
    hint: { type: String },
})


const codeChallengeSchema = new Schema<ICodeChallenge>({
    instructions: { type: String },
    initialHtml: { type: String },
    initialCss: { type: String },
    initialJs: { type: String },
    solutionHtml: { type: String },
    solutionCss: { type: String },
    solutionJs: { type: String },
    hint: { type: String },
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
        storyContext: { type: String },
        completionStory: { type: String },
        characters: { type: [String] },
        codeChallenge: { type: codeChallengeSchema },
        showCodePreview: { type: Boolean, default: false },
    },
    { timestamps: true }
)

export const Sprint = models.Sprint || model<ISprint>("Sprint", sprintSchema)