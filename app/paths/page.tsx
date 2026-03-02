import Link from "next/link"
import { connectDB } from "@/lib/mongodb"
import { Path } from "@/models/Path"

export default async function PathsPage() {
    await connectDB()

    const paths = await Path.find().lean()

    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8">
                Choose Your Skill Path 🚀
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
                {paths.map((path: any) => (
                    <Link
                        key={path._id.toString()}
                        href={`/paths/${path.slug}`}
                        className="border p-6 rounded-lg hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            {path.icon} {path.name}
                        </h2>
                        <p className="text-gray-600">
                            {path.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}