'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function NewPropertyPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceKes: '',
        priceUsd: '',
        category: 'LAND',
        status: 'SALE',
        location: '',
        bedrooms: '',
        bathrooms: '',
        sizeAcres: '',
        durationDays: '30',
        images: [] as string[],
    });



    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const uploadData = new FormData();
        files.forEach(file => uploadData.append('images', file));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                method: 'POST',
                credentials: 'include',
                body: uploadData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...data.images]
                }));
                toast.success('Images uploaded');
            } else {
                toast.error('Image upload failed');
            }
        } catch (error) {
            console.error('Upload error', error);
            toast.error('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        setLoading(true);

        const payload = {
            ...formData,
            amenities: [] // Can add amenities input later
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/properties`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('Property created successfully!');
                setTimeout(() => {
                    router.push(user?.role === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard');
                }, 1500);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to create property');
            }
        } catch (error) {
            console.error('Error creating property', error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--forest-green)] font-playfair mb-2">List a New Property</h1>
                    <p className="text-[var(--text-secondary)]">Fill in the details below to publish a new listing.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-10 space-y-10">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Property Title</label>
                                <input
                                    type="text" required
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all"
                                    placeholder="e.g. 5 Acre Plot in Karen"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
                                <select
                                    value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all bg-white"
                                >
                                    <option value="LAND">Land</option>
                                    <option value="HOUSE">House</option>
                                    <option value="COMMERCIAL">Commercial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Status</label>
                                <select
                                    value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all bg-white"
                                >
                                    <option value="SALE">For Sale</option>
                                    <option value="LEASE">For Lease</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Price (KES)</label>
                                <input
                                    type="number" required
                                    value={formData.priceKes} onChange={e => setFormData({ ...formData, priceKes: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all"
                                    placeholder="15000000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Price (USD - Optional)</label>
                                <input
                                    type="number"
                                    value={formData.priceUsd} onChange={e => setFormData({ ...formData, priceUsd: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all"
                                    placeholder="115000"
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
                            <textarea
                                required rows={4}
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all"
                                placeholder="Detailed property description..."
                            />
                        </div>

                        {/* Features - Conditional */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formData.category !== 'LAND' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Bedrooms</label>
                                        <input
                                            type="number"
                                            value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Bathrooms</label>
                                        <input
                                            type="number"
                                            value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Size (Acres)</label>
                                <input
                                    type="number"
                                    value={formData.sizeAcres} onChange={e => setFormData({ ...formData, sizeAcres: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all"
                                    placeholder="e.g. 0.5"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Location Name</label>
                                <input
                                    type="text" required
                                    value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all bg-white"
                                    placeholder="e.g. Karen, Nairobi"
                                />
                            </div>


                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Property Images</label>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--forest-green)] hover:bg-green-50 transition-all aspect-square">
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    {uploading ? (
                                        <div className="w-8 h-8 border-2 border-[var(--forest-green)] border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            <span className="text-xs text-gray-500 font-medium">Add Images</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Listing Duration */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Listing Duration</label>
                            <select
                                value={formData.durationDays}
                                onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--sage-green)] outline-none transition-all bg-white"
                            >
                                <option value="7">7 Days</option>
                                <option value="14">14 Days</option>
                                <option value="30">30 Days (Default)</option>
                                <option value="60">60 Days</option>
                                <option value="90">90 Days</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">How long should this listing remain active?</p>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                            <Link href="/dashboard/seller" className="py-3 px-8 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors">Cancel</Link>
                            <button
                                type="submit" disabled={loading}
                                className="btn-primary py-3 px-10 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Publish Listing'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
