'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Property } from '@/lib/api';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import AdminPropertiesTable from '@/components/admin/AdminPropertiesTable';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminLeadsTable from '@/components/admin/AdminLeadsTable';
import { BarChart3, Building2, Users, MessageSquare } from 'lucide-react';

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
            // Admin can see all leads, assuming admin endpoint or specific logic
            // The original used /api/leads/seller ?? which might be tailored to logged in user.
            // But for Admin, we likely want ALL leads. 
            // Previous code used: /api/leads/seller (which might just return user's leads)
            // But since Admin is "ADMIN", maybe backend handles it.
            // Wait, I added GET /api/admin/leads in backend. Let's use that!
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/leads`, { credentials: 'include' });
            if (res.ok) setLeads(await res.json());
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            Promise.all([fetchProperties(), fetchUsers(), fetchLeads()])
                .finally(() => setLoading(false));
        }
    }, [user]);

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
                            <AdminPropertiesTable
                                properties={properties}
                                onRefresh={fetchProperties}
                            />
                        )}

                        {activeTab === 'users' && (
                            <AdminUsersTable
                                users={users}
                                onRefresh={fetchUsers}
                            />
                        )}

                        {activeTab === 'leads' && (
                            <AdminLeadsTable
                                leads={leads}
                                onRefresh={fetchLeads}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
