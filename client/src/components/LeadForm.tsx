import React, { useState } from 'react';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { X, Send } from 'lucide-react';

interface LeadFormProps {
    propertyId?: string;
    sellerId?: string;
    propertyTitle?: string;
    onClose: () => void;
}

export default function LeadForm({ propertyId, sellerId, propertyTitle, onClose }: LeadFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: propertyTitle ? `I'm interested in ${propertyTitle}` : "I'm interested in finding a property.",
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
                    propertyId,
                    sellerId
                }),
            });

            if (!res.ok) throw new Error('Failed to submit inquiry');

            toast.success('Inquiry sent successfully!');
            onClose();
        } catch (error) {
            console.error('Error sending inquiry:', error);
            toast.error('Failed to send inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-playfair font-bold text-xl text-[var(--forest-green)]">Contact Agent</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your Name"
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
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--marketing-green)] focus:border-transparent outline-none transition-all"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+254..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            rows={3}
                            required
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
                        {loading ? 'Sending...' : (
                            <>
                                <Send size={18} />
                                Send Inquiry
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                        We respect your privacy. Your information will only be shared with the seller.
                    </p>
                </form>
            </div>
        </div>
    );
}
