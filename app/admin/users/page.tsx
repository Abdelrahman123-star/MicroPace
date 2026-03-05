import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import UsersClientTable from "./client-table";

export default async function AdminUsersPage() {
    await connectDB();
    const users = await User.find().select("-password").lean();

    // Serialize object IDs
    const serializedUsers = JSON.parse(JSON.stringify(users));

    return (
        <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2">Manage Users</h1>
                    <p className="text-[hsl(215,15%,45%)] font-medium">View, edit roles, or remove users from the platform.</p>
                </div>
            </div>

            <UsersClientTable initialUsers={serializedUsers} />
        </div>
    );
}
