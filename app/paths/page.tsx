import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Path } from "@/models/Path";
import { Sprint } from "@/models/Sprint";
import { ArrowLeft, Sparkles, ArrowRight, FolderOpen, Search, Zap, Layers } from "lucide-react";

export default async function PathsPage() {
    await connectDB();

    const paths = await Path.find().lean();
    const sprints = await Sprint.find().lean();

    // Calculate stats per path
    const pathStats = sprints.reduce((acc: any, sprint: any) => {
        const pId = sprint.pathId.toString();
        if (!acc[pId]) acc[pId] = { count: 0, totalXP: 0 };
        acc[pId].count += 1;
        acc[pId].totalXP += sprint.xpReward || 0;
        return acc;
    }, {});

    // Group paths by category
    const categorizedPaths = paths.reduce((acc: any, path: any) => {
        const cat = path.category || "General";
        if (!acc[cat]) acc[cat] = [];
        const stats = pathStats[path._id.toString()] || { count: 0, totalXP: 0 };
        acc[cat].push({ ...path, stats });
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[hsl(210,25%,96%)] overflow-x-hidden pt-32 pb-24">



            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[hsl(217,91%,60%,0.1)] blur-[100px]" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[hsl(199,89%,48%,0.1)] blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-[hsl(215,15%,45%)] hover:text-[hsl(217,91%,60%)] font-semibold transition-colors">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                </div>
                <div className="text-center mb-16">
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(217,91%,60%)] font-bold mb-4">
                        <Sparkles size={14} /> Path Selection
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[hsl(215,25%,15%)] mb-4">
                        Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] font-extrabold">Skill Path</span> 🚀
                    </h1>
                    <p className="text-[hsl(215,15%,45%)] text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Embark on a new learning journey. Browse through specialized categories and start your next gamified sprint today.
                    </p>
                </div>

                {paths.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-2xl border border-[hsl(210,20%,88%,0.6)] shadow-xl rounded-3xl p-12 text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center mb-6">
                            <FolderOpen className="text-[hsl(217,91%,60%)]" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-3">No Paths Available Yet</h2>
                        <p className="text-[hsl(215,15%,45%)] text-lg mb-8 max-w-lg font-medium">
                            It looks like our admins haven't created any skill paths currently. Please check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {Object.keys(categorizedPaths).map((categoryName) => (
                            <div key={categoryName}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-[hsl(210,20%,88%)] shadow-sm flex items-center justify-center">
                                        <Search className="text-[hsl(215,25%,15%)]" size={18} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[hsl(215,25%,15%)]">{categoryName}</h2>
                                    <div className="h-px bg-gradient-to-r from-[hsl(210,20%,88%)] to-transparent flex-1 ml-4 hidden sm:block"></div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {categorizedPaths[categoryName].map((path: any) => (
                                        <Link
                                            key={path._id.toString()}
                                            href={`/paths/${path.slug}`}
                                            className="group bg-white/60 backdrop-blur-xl border border-[hsl(210,20%,88%,0.5)] shadow-lg rounded-2xl p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden flex flex-col"
                                        >
                                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[hsl(217,91%,60%)] to-[hsl(199,89%,48%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="text-4xl filter drop-shadow-sm bg-[hsl(217,91%,60%,0.1)] w-14 h-14 rounded-xl flex items-center justify-center">
                                                    {path.icon || "📘"}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[hsl(210,20%,96%)] flex items-center justify-center group-hover:bg-[hsl(217,91%,60%,0.1)] transition-colors">
                                                        <ArrowRight size={16} className="text-[hsl(215,15%,45%)] group-hover:text-[hsl(217,91%,60%)]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-[hsl(215,25%,15%)] mb-2 group-hover:text-[hsl(217,91%,60%)] transition-colors">
                                                {path.name}
                                            </h3>
                                            <p className="text-[hsl(215,15%,45%)] font-medium leading-relaxed mb-6">
                                                {path.description}
                                            </p>

                                            <div className="mt-auto flex items-center gap-4 pt-4 border-t border-[hsl(210,20%,88%,0.5)]">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-[hsl(215,25%,15%)]">
                                                    <Layers size={14} className="text-[hsl(217,91%,60%)]" />
                                                    {path.stats.count} Sprints
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-[hsl(215,25%,15%)]">
                                                    <Zap size={14} className="text-[hsl(45,91%,60%)] fill-[hsl(45,91%,60%)]" />
                                                    {path.stats.totalXP} TOTAL XP
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}