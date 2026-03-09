"use server";

import { connectDB } from "@/lib/mongodb";
import { Sprint } from "@/models/Sprint";
import { revalidatePath } from "next/cache";

export async function createSprint(pathId: string, data: any) {
    await connectDB();
    const sprintData = { ...data, pathId };

    // Safeguard: remove empty string _id so Mongoose auto-generates a valid ObjectId
    if (sprintData._id === "") {
        delete sprintData._id;
    }

    const sprint = await Sprint.create(sprintData);
    revalidatePath(`/admin/paths/${pathId}/sprints`);
    revalidatePath(`/paths/${pathId}`);
    return sprint._id.toString();
}

export async function updateSprint(id: string, data: any) {
    await connectDB();
    const sprint = await Sprint.findByIdAndUpdate(id, data, {
        returnDocument: 'after'
    }).lean();

    if (sprint) {
        revalidatePath(`/admin/paths/${sprint.pathId}/sprints`);
        revalidatePath(`/paths/${sprint.pathId}`);
    }

    return JSON.parse(JSON.stringify(sprint));
}

export async function deleteSprint(id: string) {
    await connectDB();
    const sprint = await Sprint.findByIdAndDelete(id);
    if (sprint) {
        revalidatePath(`/admin/paths/${sprint.pathId}/sprints`);
        revalidatePath(`/paths/${sprint.pathId}`);
    }
    return true;
}

export async function bulkCreateSprints(pathId: string, sprints: any[]) {
    await connectDB();

    const preparedSprints = sprints.map(s => ({
        ...s,
        pathId,
        // Ensure _id is not an empty string
        _id: (s._id === "" || !s._id) ? undefined : s._id
    }));

    const created = await Sprint.insertMany(preparedSprints);
    revalidatePath(`/admin/paths/${pathId}/sprints`);
    revalidatePath(`/paths/${pathId}`);
    return created.length;
}
