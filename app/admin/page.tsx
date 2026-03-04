import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Path } from "@/models/Path";
import { Sprint } from "@/models/Sprint";
import { Users, FolderOpen, Flame, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalPaths = await Path.countDocuments();
    const totalSprints = await Sprint.countDocuments();

    // Some mock data or general sums could be calculated, but let's just show basic counts
    const adminCount = await User.countDocuments({ role: "admin" });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2">Platform Overview</h1>
                <p className="text-[hsl(215,15%,45%)] font-medium">Welcome to the administration portal. Here's what's happening today.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-[hsl(210,20%,88%)] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center">
                            <Users className="text-[hsl(217,91%,60%)]" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-[hsl(215,25%,15%)] mb-1">{totalUsers}</div>
                    <div className="text-sm font-semibold text-[hsl(215,15%,45%)] uppercase tracking-wider">Total Learners</div>
                </div>

                <div className="bg-white border border-[hsl(210,20%,88%)] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Activity className="text-orange-500" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-[hsl(215,25%,15%)] mb-1">{adminCount}</div>
                    <div className="text-sm font-semibold text-[hsl(215,15%,45%)] uppercase tracking-wider">Admins</div>
                </div>

                <div className="bg-white border border-[hsl(210,20%,88%)] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[hsl(199,89%,48%,0.1)] flex items-center justify-center">
                            <FolderOpen className="text-[hsl(199,89%,48%)]" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-[hsl(215,25%,15%)] mb-1">{totalPaths}</div>
                    <div className="text-sm font-semibold text-[hsl(215,15%,45%)] uppercase tracking-wider">Skill Paths</div>
                </div>

                <div className="bg-white border border-[hsl(210,20%,88%)] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <Flame className="text-green-500" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-[hsl(215,25%,15%)] mb-1">{totalSprints}</div>
                    <div className="text-sm font-semibold text-[hsl(215,15%,45%)] uppercase tracking-wider">Active Sprints</div>
                </div>
            </div>

            <div className="mt-12 bg-white border border-[hsl(210,20%,88%)] rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-[hsl(215,25%,15%)] mb-4">Quick Links</h2>
                <p className="text-[hsl(215,15%,45%)] font-medium mb-6">Use the sidebar to jump directly into specific management tools.</p>
                <div className="flex gap-4">
                    <a href="/admin/users" className="bg-[hsl(215,25%,15%)] text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-colors shadow-md">Manage Users</a>
                    <a href="/admin/paths" className="bg-[hsl(217,91%,60%)] text-white px-6 py-2 rounded-lg font-bold hover:bg-[hsl(217,91%,55%)] transition-colors shadow-md shadow-[hsl(217,91%,60%,0.2)]">Manage Paths</a>
                </div>
            </div>
        </div>
    );
}
