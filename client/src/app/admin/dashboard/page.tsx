'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Property } from '@/lib/api';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { BarChart3, Building2, Users, MessageSquare, Download, Check, X, Edit } from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'analytics' | 'properties' | 'users' | 'leads'>('analytics');

    const fetchProperties = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties`, { credentials: 'include' });
            if (res.ok) setProperties(await res.json());
        } catch (error) { console.error(error); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, { credentials: 'include' });
            if (res.ok) setUsers(await res.json());
        } catch (error) { console.error(error); }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/seller`, { credentials: 'include' });
            if (res.ok) setLeads(await res.json());
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            Promise.all([fetchProperties(), fetchUsers(), fetchLeads()])
                .finally(() => setLoading(false));
        }
    }, [user]);

    const handleAction = async (id: string, action: 'expire' | 'extend') => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/properties/${id}/expire`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action })
            });
            fetchProperties();
        } catch (error) { console.error(error); }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) fetchUsers();
        } catch (error) { console.error(error); }
    };

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

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-playfair">Admin Dashboard</h1>
                        <p className="text-[var(--text-secondary)] mt-1">Manage listings, analytics, users, and leads</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
                    {[
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                        { id: 'properties', label: `Properties (${properties.length})`, icon: Building2 },
                        { id: 'users', label: `Users (${users.length})`, icon: Users },
                        { id: 'leads', label: `Leads (${leads.length})`, icon: MessageSquare },
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-[var(--marketing-green)] text-[var(--marketing-green)]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'analytics' && <AnalyticsDashboard />}

                        {activeTab === 'properties' && (
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
                                                        <button onClick={() => handleAction(property.id, 'expire')} className="text-red-600 hover:text-red-900 font-medium text-xs">Expire</button>
                                                    ) : (
                                                        <button onClick={() => handleAction(property.id, 'extend')} className="text-green-600 hover:text-green-900 font-medium text-xs">Renew</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'users' && (
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
                                                <td className="px-6 py-4 text-right">
                                                    {u.role !== 'ADMIN' && (
                                                        <button
                                                            onClick={() => toggleUserStatus(u.id, u.isActive !== false)}
                                                            className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${u.isActive !== false
                                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                                }`}
                                                        >
                                                            {u.isActive !== false ? 'Disable' : 'Enable'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'leads' && (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <button
                                        onClick={downloadLeadsCSV}
                                        className="flex items-center gap-2 px-4 py-2 bg-[var(--marketing-green)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-forest-light)] transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export CSV
                                    </button>
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
                                                        <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {leads.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                                        No leads found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
