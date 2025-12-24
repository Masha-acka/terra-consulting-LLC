'use client';

import { useState } from 'react';
import { Download, MessageSquarePlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLeadForm from './AdminLeadForm';

interface AdminLeadsTableProps {
    leads: any[];
    onRefresh: () => void;
}

export default function AdminLeadsTable({ leads, onRefresh }: AdminLeadsTableProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const confirmDelete = (id: string) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-medium text-gray-900">Delete this lead?</span>
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

    const updateLeadStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success('Status updated');
                onRefresh();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/leads/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Lead deleted successfully');
                onRefresh();
            } else {
                toast.error('Failed to delete lead');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setDeletingId(null);
        }
    };

    // ... inside return ...
    // Update button logic at line 123 (original file) or find via TargetContent
    // Since I can't do non-contiguous edits easily, I'll rely on a second Replace call or match the block.
    // I replaced handleDelete. I still need to update the JSX button.

    const downloadLeadsCSV = () => {
        const headers = ['Name,Email,Phone,Message,Property,Seller,Status,Date'];
        const csv = leads.map(lead => [
            `"${lead.name}"`,
            `"${lead.email}"`,
            `"${lead.phone || ''}"`,
            `"${lead.message || ''}"`,
            `"${lead.property?.title || 'General Inquiry'}"`,
            `"${lead.seller?.name || 'Unassigned'}"`,
            lead.status,
            new Date(lead.createdAt).toLocaleDateString()
        ].join(','));

        const blob = new Blob([headers.concat(csv).join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Lead Management</h3>
                <div className="flex gap-2">
                    <button
                        onClick={downloadLeadsCSV}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--marketing-green)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-forest-light)] transition-colors"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        Add Lead
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Lead</th>
                            <th className="px-6 py-4 font-semibold">Interest</th>
                            <th className="px-6 py-4 font-semibold">Message</th>
                            <th className="px-6 py-4 font-semibold">Seller</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{lead.name}</span>
                                        <span className="text-xs text-gray-500">{lead.email}</span>
                                        <span className="text-xs text-gray-400">{lead.phone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {lead.property?.title || 'General Inquiry'}
                                </td>
                                <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={lead.message}>
                                    {lead.message}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {lead.seller?.name || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-[var(--marketing-green)] ${lead.status === 'NEW' ? 'bg-blue-50 text-blue-700' :
                                            lead.status === 'CONTACTED' ? 'bg-yellow-50 text-yellow-700' :
                                                lead.status === 'CLOSED' ? 'bg-green-50 text-green-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        <option value="NEW">New</option>
                                        <option value="CONTACTED">Contacted</option>
                                        <option value="CLOSED">Closed</option>
                                        <option value="LOST">Lost</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => confirmDelete(lead.id)}
                                        disabled={deletingId === lead.id}
                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                        title="Delete Lead"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                    No leads found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <AdminLeadForm
                    onClose={() => setShowAddModal(false)}
                    onSuccess={onRefresh}
                />
            )}
        </div>
    );
}
