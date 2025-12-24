'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Property } from '@/lib/api';

interface AdminPropertiesTableProps {
    properties: Property[];
    onRefresh: () => void;
}

export default function AdminPropertiesTable({ properties, onRefresh }: AdminPropertiesTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAction = async (id: string, action: 'expire' | 'extend') => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${id}/expire`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action })
            });
            onRefresh();
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                onRefresh();
            } else {
                alert('Failed to delete property');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Property Listings</h3>
                <Link
                    href="/seller/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--marketing-green)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-forest-light)] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    List Property
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Property</th>
                            <th className="px-6 py-4 font-semibold">Owner</th>
                            <th className="px-6 py-4 font-semibold">Expiry</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {properties.map((property) => (
                            <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{property.title}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{property.owner?.name}</span>
                                        <span className="text-xs">{property.owner?.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {property.expiresAt ? new Date(property.expiresAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${property.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {property.isActive ? 'Active' : 'Expired'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                                    <Link href={`/seller/edit/${property.id}`} className="text-blue-600 hover:text-blue-900 font-medium text-xs flex items-center gap-1">
                                        <Edit className="w-3 h-3" /> Edit
                                    </Link>

                                    {property.isActive ? (
                                        <button onClick={() => handleAction(property.id, 'expire')} className="text-orange-600 hover:text-orange-900 font-medium text-xs">Expire</button>
                                    ) : (
                                        <button onClick={() => handleAction(property.id, 'extend')} className="text-green-600 hover:text-green-900 font-medium text-xs">Renew</button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        disabled={deletingId === property.id}
                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                        title="Delete Property"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
