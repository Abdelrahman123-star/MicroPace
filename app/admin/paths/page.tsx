import { connectDB } from "@/lib/mongodb";
import { Path } from "@/models/Path";
import PathsClientPage from "./client-page";

export default async function AdminPathsPage() {
    await connectDB();
    const paths = await Path.find().lean();

    // get unique categories
    const categories = Array.from(new Set(paths.map((p: any) => p.category || "General")));

    // Serialize Object Ids
    const serializedPaths = paths.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString() || null,
        updatedAt: p.updatedAt?.toISOString() || null,
    }));

    return <PathsClientPage initialPaths={serializedPaths} categories={categories as string[]} />;
}
