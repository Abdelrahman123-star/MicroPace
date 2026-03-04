import { requireAuth } from "@/middleware/middleware";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FolderOpen, ArrowLeft } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireAuth();

    if (user.role !== "admin") {
        redirect("/profile");
    }

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] flex flex-col md:flex-row pt-20">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-[hsl(210,20%,88%)] p-6 md:sticky top-20 h-auto md:h-[calc(100vh-80px)] overflow-y-auto z-10">
                <div className="mb-8">
                    <p className="text-xs font-bold text-[hsl(215,15%,45%)] uppercase tracking-wider mb-2">Admin Portal</p>
                    <h2 className="text-xl font-black text-[hsl(215,25%,15%)]">Dashboard</h2>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[hsl(215,25%,15%)] font-semibold hover:bg-[hsl(210,20%,96%)] transition-colors">
                        <LayoutDashboard size={18} className="text-[hsl(217,91%,60%)]" /> Overview
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[hsl(215,25%,15%)] font-semibold hover:bg-[hsl(210,20%,96%)] transition-colors">
                        <Users size={18} className="text-orange-500" /> Users
                    </Link>
                    <Link href="/admin/paths" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[hsl(215,25%,15%)] font-semibold hover:bg-[hsl(210,20%,96%)] transition-colors">
                        <FolderOpen size={18} className="text-[hsl(199,89%,48%)]" /> Paths & Sprints
                    </Link>
                </nav>

                <div className="mt-8 pt-6 border-t border-[hsl(210,20%,88%)]">
                    <Link href="/profile" className="flex items-center gap-2 text-sm text-[hsl(215,15%,45%)] hover:text-[hsl(215,25%,15%)] font-semibold transition-colors">
                        <ArrowLeft size={16} /> Back to Profile
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 relative">
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[hsl(217,91%,60%,0.05)] blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
