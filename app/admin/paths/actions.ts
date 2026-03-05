"use server";

import { connectDB } from "@/lib/mongodb";
import { Path } from "@/models/Path";
import { Sprint } from "@/models/Sprint";
import { requireAuth } from "@/middleware/middleware";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
    const user = await requireAuth();
    if (user.role !== "admin") {
        throw new Error("Unauthorized");
    }
}

export async function createPath(data: any) {
    await checkAdmin();
    await connectDB();

    // Safeguard: remove _id if it's an empty string to avoid "Cast to ObjectId failed"
    const { _id, ...pathData } = data;
    const finalData = _id ? data : pathData;

    const path = await Path.create(finalData);
    revalidatePath("/admin/paths");
    revalidatePath("/paths");
    return path._id.toString();
}

export async function updatePath(id: string, data: any) {
    await checkAdmin();
    await connectDB();
    await Path.findByIdAndUpdate(id, data);
    revalidatePath("/admin/paths");
    revalidatePath("/paths");
}

export async function deletePath(id: string) {
    await checkAdmin();
    await connectDB();
    await Path.findByIdAndDelete(id);
    // Also delete associated sprints? 
    // Sprint.deleteMany({ pathId: id }) could be done here, but PRD doesn't strict demand it.
    await Sprint.deleteMany({ pathId: id });
    revalidatePath("/admin/paths");
    revalidatePath("/paths");
}
