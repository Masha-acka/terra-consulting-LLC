'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import PropertyDetail from '@/components/PropertyDetail';
import { Property } from '@/lib/api';

export default function BuyerDashboard() {
    const { user } = useAuth();
    const [savedProperties, setSavedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    useEffect(() => {
        async function fetchSaved() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/saved`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    setSavedProperties(data);
                }
            } catch (error) {
                console.error('Failed to fetch saved properties', error);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchSaved();
        }
    }, [user]);

    const handleRemove = async (propertyId: string) => {
        try {
            // Optimistic update
            setSavedProperties(prev => prev.filter(p => p.id !== propertyId));

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/saved/${propertyId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Failed to remove property', error);
            // Could revert logic here if strict sync is needed
        }
    };

    if (!user) return <div className="p-8 text-center text-[var(--text-secondary)]">Please log in to view saved properties.</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[var(--forest-green)] font-playfair mb-3">My Saved Properties</h1>
                <p className="text-[var(--text-secondary)]">Your personal collection of favorite homes.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-[var(--sage-green)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : savedProperties.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved properties yet</h3>
                    <p className="text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">Start exploring our exclusive listings and click the heart icon to save your favorites.</p>
                    <Link href="/" className="btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all inline-block">
                        Explore Properties
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {savedProperties.map(property => (
                        <div key={property.id} className="w-full max-w-sm">
                            <PropertyCard
                                property={property}
                                isSelected={selectedProperty?.id === property.id}
                                isFavorite={true}
                                onToggleFavorite={() => handleRemove(property.id)}
                                onClick={() => setSelectedProperty(property)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Property Detail Modal */}
            {selectedProperty && (
                <PropertyDetail
                    property={selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                />
            )}
        </div>
    );
}
