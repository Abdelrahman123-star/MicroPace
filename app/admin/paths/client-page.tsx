"use client";

import { useState } from "react";
import { createPath, updatePath, deletePath } from "./actions";
import { Trash2, Edit, Plus, X } from "lucide-react";

export default function PathsClientPage({ initialPaths, categories }: { initialPaths: any[], categories: string[] }) {
    const [paths, setPaths] = useState(initialPaths);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<any>({
        _id: "",
        name: "",
        slug: "",
        description: "",
        icon: "",
        category: "General",
    });

    const handleOpenCreate = () => {
        setFormData({ _id: "", name: "", slug: "", description: "", icon: "", category: "General" });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (path: any) => {
        setFormData(path);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this path? All associated sprints will be removed.")) return;
        setLoading(true);
        try {
            await deletePath(id);
            setPaths(paths.filter(p => p._id !== id));
        } catch (error) {
            console.error("Failed to delete path", error);
            alert("Failed to delete path");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (formData._id) {
                await updatePath(formData._id, formData);
                setPaths(paths.map(p => (p._id === formData._id ? formData : p)));
            } else {
                const newId = await createPath(formData);
                setPaths([...paths, { ...formData, _id: newId }]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save path", error);
            alert("Failed to save path. Check your connection or uniqueness of Slug.");
        }
        setLoading(false);
    };

    return (
        <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[hsl(215,25%,15%)] mb-2">Manage Paths</h1>
                    <p className="text-[hsl(215,15%,45%)] font-medium">Create, edit, classify, and delete paths.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-[hsl(217,91%,60%)] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[hsl(217,91%,55%)] transition-colors inline-flex items-center gap-2 shadow-[0_0_20px_hsl(217,91%,60%,0.2)]"
                >
                    <Plus size={18} /> New Path
                </button>
            </div>

            <div className="bg-white border border-[hsl(210,20%,88%)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[hsl(210,25%,96%)] border-b border-[hsl(210,20%,88%)]">
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)] w-12">Icon</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Path Name</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Category</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Description</th>
                                <th className="p-4 font-bold text-[hsl(215,25%,15%)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(210,20%,88%)]">
                            {paths.map((p) => (
                                <tr key={p._id} className="hover:bg-[hsl(210,25%,98%)] transition-colors">
                                    <td className="p-4 text-center text-3xl">{p.icon}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-[hsl(215,25%,15%)]">{p.name}</div>
                                        <div className="text-xs text-[hsl(215,15%,45%)] font-mono">{p.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block bg-[hsl(210,20%,90%)] text-[hsl(215,15%,45%)] px-3 py-1 rounded-full text-xs font-bold">
                                            {p.category || "General"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-[hsl(215,15%,45%)] font-medium max-w-xs truncate">
                                        {p.description}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(p)}
                                                className="p-2 text-[hsl(215,15%,45%)] hover:bg-[hsl(210,20%,90%)] rounded-lg transition-colors"
                                                title="Edit Path"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                disabled={loading}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete Path"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paths.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-[hsl(215,15%,45%)]">
                                        No paths found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white border border-[hsl(210,20%,88%)] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-[hsl(210,20%,88%)] pb-4">
                            <h2 className="text-xl font-bold text-[hsl(215,25%,15%)]">
                                {formData._id ? "Edit Path" : "Create New Path"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[hsl(215,15%,45%)] hover:text-black">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto w-full">
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-1">Path Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl px-4 py-3 bg-[hsl(210,25%,98%)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Frontend Master"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-1">Slug</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl px-4 py-3 bg-[hsl(210,25%,98%)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium font-mono text-sm"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="e.g. frontend-master"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-1">Category</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl px-4 py-3 bg-[hsl(210,25%,98%)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="e.g. Frontend"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-1">Icon (Emoji)</label>
                                        <input
                                            type="text"
                                            className="w-full border border-[hsl(210,20%,88%)] rounded-xl px-4 py-3 bg-[hsl(210,25%,98%)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            placeholder="e.g. ⚛️"
                                            maxLength={5}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[hsl(215,25%,15%)] mb-1">Description</label>
                                    <textarea
                                        required
                                        className="w-full border border-[hsl(210,20%,88%)] rounded-xl px-4 py-3 bg-[hsl(210,25%,98%)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)] transition-all font-medium min-h-[100px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the path..."
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-[hsl(215,15%,45%)] hover:bg-[hsl(210,20%,96%)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 rounded-xl font-bold bg-[hsl(217,91%,60%)] text-white hover:bg-[hsl(217,91%,55%)] transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : formData._id ? "Update Path" : "Create Path"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
