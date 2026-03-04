"use server";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAuth } from "@/middleware/middleware";
import { revalidatePath } from "next/cache";

// Helper to authenticate admin
async function checkAdmin() {
    const user = await requireAuth();
    if (user.role !== "admin") {
        throw new Error("Unauthorized");
    }
}

export async function deleteUser(userId: string) {
    await checkAdmin();
    await connectDB();
    await User.findByIdAndDelete(userId);
    revalidatePath("/admin/users");
}

export async function updateUserRole(userId: string, newRole: string) {
    await checkAdmin();
    await connectDB();
    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath("/admin/users");
}
