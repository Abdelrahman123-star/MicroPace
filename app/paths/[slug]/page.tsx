import Link from "next/link"
import { notFound } from "next/navigation"
import { connectDB } from "@/lib/mongodb"
import { Path } from "@/models/Path"
import { Sprint } from "@/models/Sprint"

interface Props {
    params: Promise<{ slug: string }>
}

export default async function PathDetailPage({ params }: Props) {
    const { slug } = await params

    await connectDB()

    const path = await Path.findOne({ slug }).lean()
    if (!path) return notFound()

    const sprints = await Sprint.find({ pathId: path._id })
        .sort({ order: 1 })
        .lean()

    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8">
                {path.icon} {path.name}
            </h1>

            <div className="space-y-4">
                {sprints.map((sprint: any) => (
                    <Link
                        key={sprint._id.toString()}
                        href={`/paths/${slug}/${sprint.slug}`}
                        className="block border p-4 rounded hover:shadow transition"
                    >
                        <h2 className="font-semibold">{sprint.title}</h2>
                        <p className="text-sm text-gray-500">
                            XP Reward: {sprint.xpReward}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}