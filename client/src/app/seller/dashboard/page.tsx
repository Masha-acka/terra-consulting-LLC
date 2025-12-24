'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Property, formatKES, formatPriceByType } from '@/lib/api';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Plus, MapPin, Edit, Trash2, Package, BarChart3, Building2, MessageSquare, UserPlus } from 'lucide-react';
import ManualLeadForm from '@/components/ManualLeadForm';

export default function SellerDashboard() {
    const { user } = useAuth();
    const [myProperties, setMyProperties] = useState<Property[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'analytics' | 'properties' | 'leads'>('analytics');
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);

    const fetchProperties = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/properties`, { credentials: 'include' });
            if (res.ok) setMyProperties(await res.json());
        } catch (error) { console.error(error); }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/seller`, { credentials: 'include' });
            if (res.ok) setLeads(await res.json());
        } catch (error) { console.error(error); }
    };

    const updateLeadStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchLeads();
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        if (user) {
            Promise.all([fetchProperties(), fetchLeads()])
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[var(--marketing-cream)] pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-8">
                    <div>
                        <span className="text-[var(--marketing-gold)] font-medium tracking-widest uppercase mb-2 block">Seller Portal</span>
                        <h1 className="text-4xl font-playfair font-bold text-[var(--marketing-green)]">My Dashboard</h1>
                        <p className="text-[var(--text-secondary)] mt-2 font-light">Manage your property portfolio and view leads</p>
                    </div>
                    <Link href="/seller/new" className="btn-primary flex items-center gap-2 shadow-lg">
                        <Plus className="w-5 h-5" />
                        New Listing
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === 'analytics'
                            ? 'border-[var(--marketing-green)] text-[var(--marketing-green)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === 'properties'
                            ? 'border-[var(--marketing-green)] text-[var(--marketing-green)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Building2 className="w-4 h-4" />
                        My Properties ({myProperties.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === 'leads'
                            ? 'border-[var(--marketing-green)] text-[var(--marketing-green)]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Leads ({leads.length})
                    </button>
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-12 h-12 border-2 border-[var(--marketing-green)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'analytics' && <AnalyticsDashboard />}

                        {activeTab === 'properties' && (
                            myProperties.length === 0 ? (
                                <div className="text-center py-24 bg-white border border-gray-100 shadow-sm rounded-2xl">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Package className="w-10 h-10 text-[var(--marketing-green)] opacity-50" />
                                    </div>
                                    <h3 className="text-2xl font-playfair font-bold text-[var(--marketing-green)] mb-3">No active listings</h3>
                                    <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto font-light">Your portfolio is currently empty. Start showcasing your properties.</p>
                                    <Link href="/seller/new" className="text-[var(--marketing-gold)] font-medium hover:text-[var(--marketing-green)] transition-colors uppercase tracking-widest text-sm border-b border-[var(--marketing-gold)] pb-1">
                                        Create First Listing
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-[var(--text-secondary)] text-xs uppercase tracking-widest font-medium">
                                            <tr>
                                                <th className="px-8 py-6 font-medium">Property</th>
                                                <th className="px-8 py-6 font-medium">Price</th>
                                                <th className="px-8 py-6 font-medium">Status</th>
                                                <th className="px-8 py-6 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {myProperties.map((property) => (
                                                <tr key={property.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-24 h-24 bg-gray-100 flex-shrink-0 bg-cover bg-center rounded-lg shadow-sm" style={{ backgroundImage: `url(${property.images[0] || '/placeholder.jpg'})` }}></div>
                                                            <div>
                                                                <p className="font-playfair font-bold text-lg text-[var(--marketing-green)] group-hover:text-[var(--marketing-gold)] transition-colors mb-1">{property.title}</p>
                                                                <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 font-light">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    {property.location}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 font-medium text-gray-900 font-playfair text-lg">
                                                        {formatPriceByType(property.priceKes, property.priceType, 'KES')}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${property.status === 'SALE'
                                                            ? 'bg-[var(--marketing-gold)] text-white'
                                                            : 'bg-[var(--marketing-green)] text-white'
                                                            }`}>
                                                            {property.status === 'SALE' ? 'On Sale' : 'For Lease'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-6">
                                                            <Link href={`/seller/edit/${property.id}`} className="text-[var(--text-secondary)] hover:text-[var(--marketing-green)] font-medium text-sm transition-colors flex items-center gap-2">
                                                                <Edit className="w-4 h-4" />
                                                                <span className="hidden sm:inline">Edit</span>
                                                            </Link>
                                                            <button className="text-red-400 hover:text-red-600 font-medium text-sm transition-colors flex items-center gap-2">
                                                                <Trash2 className="w-4 h-4" />
                                                                <span className="hidden sm:inline">Delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}

                        {activeTab === 'leads' && (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowAddLeadModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--marketing-green)] text-[var(--marketing-green)] rounded-lg text-sm font-medium hover:bg-[var(--marketing-green)] hover:text-white transition-colors"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Add Lead Manually
                                    </button>
                                </div>
                                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 text-[var(--text-secondary)] text-xs uppercase tracking-widest font-medium">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Date</th>
                                                <th className="px-6 py-4 font-medium">Prospect</th>
                                                <th className="px-6 py-4 font-medium">Interest</th>
                                                <th className="px-6 py-4 font-medium">Message</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
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
                                                </tr>
                                            ))}
                                            {leads.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                                        No leads found yet.
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

                {showAddLeadModal && (
                    <ManualLeadForm
                        sellerId={user.id}
                        properties={myProperties}
                        onClose={() => setShowAddLeadModal(false)}
                        onSuccess={fetchLeads}
                    />
                )}
            </div>
        </div>
    );
}
