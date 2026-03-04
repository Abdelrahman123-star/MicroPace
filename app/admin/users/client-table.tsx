"use client";

import { useState } from "react";
import { deleteUser, updateUserRole } from "./actions";
import { Trash2, Shield, User as UserIcon } from "lucide-react";

export default function UsersClientTable({ initialUsers }: { initialUsers: any[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        setLoading(id);
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Failed to delete user. Make sure you have admin rights.");
        }
        setLoading(null);
    };

    const handleRoleChange = async (id: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        setLoading(id);
        try {
            await updateUserRole(id, newRole);
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Failed to update role", error);
            alert("Failed to update role.");
        }
        setLoading(null);
    };

    return (
        <div className="bg-white border border-[hsl(210,20%,88%)] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[hsl(210,25%,96%)] border-b border-[hsl(210,20%,88%)]">
                            <th className="p-4 font-bold text-[hsl(215,25%,15%)]">User</th>
                            <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Email</th>
                            <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Progress</th>
                            <th className="p-4 font-bold text-[hsl(215,25%,15%)]">Role</th>
                            <th className="p-4 font-bold text-[hsl(215,25%,15%)]text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(210,20%,88%)]">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-[hsl(210,25%,98%)] transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[hsl(217,91%,60%,0.1)] flex items-center justify-center text-[hsl(217,91%,60%)] font-bold">
                                            {u.username.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="font-semibold text-[hsl(215,25%,15%)]">{u.username}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-[hsl(215,15%,45%)] font-medium">
                                    {u.email}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[hsl(217,91%,60%)]">{u.totalXP || 0} XP</span>
                                        <span className="text-sm text-[hsl(215,15%,45%)]">| {u.currentStreak || 0} span</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-[hsl(210,20%,90%)] text-[hsl(215,15%,45%)]'}`}>
                                        {u.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleRoleChange(u._id, u.role)}
                                            disabled={loading === u._id}
                                            className="px-3 py-1 bg-white border border-[hsl(210,20%,88%)] rounded-lg text-sm font-semibold hover:bg-[hsl(210,20%,96%)] transition-colors disabled:opacity-50"
                                            title="Toggle Role"
                                        >
                                            {loading === u._id ? "..." : "Toggle Role"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            disabled={loading === u._id}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-[hsl(215,15%,45%)]">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
