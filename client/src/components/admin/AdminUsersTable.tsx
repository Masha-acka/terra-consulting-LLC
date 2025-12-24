'use client';

import { useState } from 'react';
import { Trash2, UserPlus, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminUserForm from './AdminUserForm';

interface AdminUsersTableProps {
    users: any[];
    onRefresh: () => void;
}

export default function AdminUsersTable({ users, onRefresh }: AdminUsersTableProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) onRefresh();
        } catch (error) { console.error(error); }
    };

    const confirmDelete = (id: string) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-medium text-gray-900">Delete this user?</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            handleDelete(id);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 5000, icon: '⚠️' });
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('User deleted successfully');
                onRefresh();
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting user');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--marketing-green)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-forest-light)] transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Properties</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{u.name}</span>
                                        <span className="text-xs text-gray-500">{u.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{u.role}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{u._count?.properties || 0}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {u.isActive !== false ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end items-center gap-3">
                                    {u.role !== 'ADMIN' && (
                                        <>
                                            <button
                                                onClick={() => toggleUserStatus(u.id, u.isActive !== false)}
                                                className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${u.isActive !== false
                                                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    }`}
                                            >
                                                {u.isActive !== false ? 'Disable' : 'Enable'}
                                            </button>

                                            <button
                                                onClick={() => confirmDelete(u.id)}
                                                disabled={deletingId === u.id}
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <AdminUserForm
                    onClose={() => setShowAddModal(false)}
                    onSuccess={onRefresh}
                />
            )}
        </div>
    );
}
