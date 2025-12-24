'use client';

import Link from 'next/link';
import { Property, formatKES, formatUSD } from '@/lib/api';
import { MapPin, BedDouble, Bath, Maximize, Heart } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
    isSelected?: boolean;
    onClick?: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

export default function PropertyCard({ property, isSelected, onClick, isFavorite, onToggleFavorite }: PropertyCardProps) {
    const defaultImage = '/placeholder.jpg';
    const mainImage = property.images?.[0] || defaultImage;

    const content = (
        <div className={`property-card group bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500 ${isSelected
            ? 'ring-2 ring-[var(--marketing-gold)] shadow-xl shadow-[var(--marketing-gold)]/10'
            : 'shadow-sm hover:shadow-xl hover:shadow-gray-200/50 border border-gray-100 hover:border-transparent'
            }`}>
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${mainImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-[var(--marketing-green)] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {property.category}
                    </span>
                    <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm ${property.status === 'SALE'
                        ? 'bg-[var(--marketing-gold)] text-[var(--marketing-green)]'
                        : 'bg-[var(--marketing-green)] text-white'
                        }`}>
                        {property.status === 'SALE' ? 'For Sale' : 'For Lease'}
                    </span>
                </div>

                {/* Favorite Button */}
                {onToggleFavorite && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleFavorite();
                        }}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-all z-10 ${isFavorite
                                ? 'bg-red-500 text-white'
                                : 'bg-white/20 text-white hover:bg-white hover:text-red-500'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                )}

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="font-playfair font-bold text-2xl text-white tracking-tight drop-shadow-lg">
                            {formatKES(property.priceKes)}
                        </p>
                        {property.priceUsd && (
                            <p className="text-sm text-white/80 font-light">
                                {formatUSD(property.priceUsd)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-playfair font-bold text-[var(--marketing-green)] line-clamp-1 mb-2 group-hover:text-[var(--marketing-gold)] transition-colors duration-300">
                    {property.title}
                </h3>

                <div className="flex items-center text-[var(--text-secondary)] mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-[var(--marketing-gold)] flex-shrink-0" />
                    <span className="text-sm font-medium line-clamp-1">{property.location}</span>
                </div>

                {/* Features */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-2">
                        {property.category !== 'LAND' && property.bedrooms ? (
                            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                                <BedDouble className="w-4 h-4 text-[var(--marketing-green)] mb-1" />
                                <span className="text-sm font-bold text-gray-900">{property.bedrooms}</span>
                                <span className="text-[10px] text-gray-400 uppercase">Beds</span>
                            </div>
                        ) : null}
                        {property.category !== 'LAND' && property.bathrooms ? (
                            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
                                <Bath className="w-4 h-4 text-[var(--marketing-green)] mb-1" />
                                <span className="text-sm font-bold text-gray-900">{property.bathrooms}</span>
                                <span className="text-[10px] text-gray-400 uppercase">Baths</span>
                            </div>
                        ) : null}
                        <div className={`flex flex-col items-center p-2 bg-gray-50 rounded-xl ${property.category === 'LAND' ? 'col-span-3' : ''}`}>
                            <Maximize className="w-4 h-4 text-[var(--marketing-green)] mb-1" />
                            <span className="text-sm font-bold text-gray-900">{(property.sizeAcres || 0).toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400 uppercase">Acres</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (onClick) {
        return (
            <div onClick={onClick} className="block cursor-pointer h-full">
                {content}
            </div>
        );
    }

    return (
        <Link href={`/properties/${property.id}`} className="block h-full">
            {content}
        </Link>
    );
}
