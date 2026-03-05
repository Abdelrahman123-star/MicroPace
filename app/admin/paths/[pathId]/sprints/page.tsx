import { connectDB } from "@/lib/mongodb";
import { Sprint } from "@/models/Sprint";
import { Path } from "@/models/Path";
import SprintsClientPage from "./client-page";

export default async function AdminSprintsPage({ params }: { params: Promise<{ pathId: string }> }) {
    await connectDB();
    const { pathId } = await params;

    const path = await Path.findById(pathId).lean();
    if (!path) {
        return <div className="p-8 text-center text-red-500">Path not found</div>;
    }

    const sprints = await Sprint.find({ pathId }).sort({ order: 1 }).lean();

    const serializedSprints = JSON.parse(JSON.stringify(sprints));
    const serializedPath = JSON.parse(JSON.stringify(path));

    return <SprintsClientPage targetPath={serializedPath} initialSprints={serializedSprints} />;
}
