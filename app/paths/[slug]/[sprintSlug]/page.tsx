export const dynamic = "force-dynamic";
import { notFound } from "next/navigation"
import { connectDB } from "@/lib/mongodb"
import { Path } from "@/models/Path"
import { Sprint } from "@/models/Sprint"
import SprintStepper from "./SprintStepper"
import { requireAuth } from "@/middleware/middleware";

interface Props {
    params: Promise<{ slug: string; sprintSlug: string }>
}

export default async function SprintPage({ params }: Props) {
    const { slug, sprintSlug } = await params
    const user = await requireAuth();
    await connectDB()

    // find path
    const path = await Path.findOne({ slug }).lean()
    if (!path) return notFound()

    // find current sprint
    const sprint = await Sprint.findOne({ slug: sprintSlug, pathId: path._id }).lean()
    if (!sprint) return notFound()

    // find the next sprint in this path (by order)
    const nextSprint = await Sprint.findOne({
        pathId: path._id,
        order: sprint.order + 1,
    }).lean()

    return (
        <SprintStepper
            sprintId={sprint._id.toString()}
            pathId={path._id.toString()}
            pathSlug={slug}
            sprintTitle={sprint.title}
            lessonContent={sprint.lessonContent}
            codeSnippet={sprint.codeSnippet}
            codeLanguage={sprint.codeLanguage}
            questions={JSON.parse(JSON.stringify(sprint.questions || []))}
            xpReward={sprint.xpReward}
            nextSprintSlug={nextSprint?.slug}
            nextSprintTitle={nextSprint?.title}
            storyContext={sprint.storyContext}
            completionStory={sprint.completionStory}
            characters={sprint.characters || []}
            codeChallenge={sprint.codeChallenge ? JSON.parse(JSON.stringify(sprint.codeChallenge)) : undefined}
            showCodePreview={!!sprint.showCodePreview}
        />
    )
}