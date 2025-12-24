
import React, { useState } from 'react';
import { getApiUrl, Property } from '@/lib/api';
import toast from 'react-hot-toast';
import { X, Send, Building2 } from 'lucide-react';

interface ManualLeadFormProps {
    sellerId: string;
    properties: Property[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function ManualLeadForm({ sellerId, properties, onClose, onSuccess }: ManualLeadFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: 'Manual entry via Dashboard',
        propertyId: properties.length > 0 ? properties[0].id : '',
        status: 'NEW'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${getApiUrl()}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    sellerId
                }),
            });

            if (!res.ok) throw new Error('Failed to create lead');

            toast.success('Lead created successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating lead:', error);
            toast.error('Failed to create lead.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-playfair font-bold text-xl text-[var(--marketing-green)]">Add New Lead</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prospect Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+254..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property of Interest</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all appearance-none bg-white"
                                value={formData.propertyId}
                                onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
                            >
                                <option value="">General (No specific property)</option>
                                {properties.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all bg-white"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="CLOSED">Closed</option>
                                <option value="LOST">Lost</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message / Notes</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all resize-none"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--marketing-green)] hover:bg-[var(--color-forest-light)] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-[0.98]"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Send size={18} />
                                Create Lead
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
