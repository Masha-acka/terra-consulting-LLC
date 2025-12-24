'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Property, formatKES, formatUSD, formatPriceByType, getWhatsAppLink } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { MapPin, ArrowLeft, ChevronLeft, ChevronRight, BedDouble, Bath, Maximize, CheckCircle, Share2, Printer, X, Calendar, Copy, Check, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LeadForm from './LeadForm';

function SaveButton({ propertyId }: { propertyId: string }) {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            alert('Please login to save properties');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/saved/${propertyId}`, {
                method: saved ? 'DELETE' : 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                setSaved(!saved);
            }
        } catch (error) {
            console.error('Failed to update save status', error);
        }
    };

    if (!user || user.role !== 'BUYER') return null;

    return (
        <button
            onClick={handleSave}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${saved
                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            <svg
                className={`w-4 h-4 ${saved ? 'fill-current' : 'fill-none stroke-current'}`}
                viewBox="0 0 24 24"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {saved ? 'Saved' : 'Save'}
        </button>
    );
}

export default function PropertyDetail({ property, onClose }: { property: Property; onClose?: () => void }) {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const { user } = useAuth();
    // router is already declared above

    // Track view on mount
    useEffect(() => {
        const trackView = async () => {
            try {
                // Get or create visitor ID
                let visitorId = localStorage.getItem('visitorId');
                if (!visitorId) {
                    visitorId = crypto.randomUUID();
                    localStorage.setItem('visitorId', visitorId);
                }

                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        propertyId: property.id,
                        visitorId,
                        userId: user?.id
                    })
                });
            } catch (error) {
                console.error('Failed to track view', error);
            }
        };

        trackView();
    }, [property.id, user?.id]);
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };

    // Share listing functionality
    const handleShare = async () => {
        const shareUrl = typeof window !== 'undefined' ? window.location.origin + `/properties/${property.id}` : '';
        const shareData = {
            title: property.title,
            text: `Check out this property: ${property.title} - ${formatPriceByType(property.priceKes, property.priceType, 'KES')}`,
            url: shareUrl,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                toast.success('Shared successfully!');
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(`${property.title} - ${formatPriceByType(property.priceKes, property.priceType, 'KES')}\n${shareUrl}`);
                setCopied(true);
                toast.success('Link copied to clipboard!');
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (error) {
            // User cancelled or error
            if ((error as Error).name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(`${property.title} - ${formatPriceByType(property.priceKes, property.priceType, 'KES')}\n${shareUrl}`);
                    setCopied(true);
                    toast.success('Link copied to clipboard!');
                    setTimeout(() => setCopied(false), 2000);
                } catch {
                    toast.error('Failed to share');
                }
            }
        }
    };

    // Schedule viewing - opens WhatsApp with viewing request
    const handleScheduleViewing = () => {
        const phoneNumber = '+254700000000'; // Replace with actual number
        const message = `Hello! I would like to schedule a viewing for:\n\n*${property.title}*\nLocation: ${property.location}\nPrice: ${formatPriceByType(property.priceKes, property.priceType, 'KES')}\n\nPlease let me know available dates and times.`;
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Print brochure functionality - matches the property detail view
    const handlePrint = () => {
        const currentImage = property.images[currentImageIndex] || '/placeholder.jpg';

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${property.title} - Property Brochure | Terra Consulting LLC</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        background: #FCFCFA;
                        color: #1A1A1A;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .playfair { font-family: 'Georgia', 'Times New Roman', serif; }
                    
                    /* Hero Section */
                    .hero {
                        position: relative;
                        height: 400px;
                        background-image: url('${currentImage}');
                        background-size: cover;
                        background-position: center;
                    }
                    .hero-overlay {
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
                    }
                    .hero-content {
                        position: absolute;
                        bottom: 24px;
                        left: 24px;
                        color: white;
                    }
                    .badges {
                        display: flex;
                        gap: 8px;
                        margin-bottom: 12px;
                    }
                    .badge {
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 10px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .badge-status { background: #0A3228; color: white; }
                    .badge-category { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); }
                    .hero-title {
                        font-size: 32px;
                        font-weight: bold;
                        margin-bottom: 8px;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }
                    .hero-location {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        font-size: 14px;
                        color: #f3f3f3;
                    }
                    
                    /* Content Section */
                    .content {
                        background: white;
                        padding: 40px 24px;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    
                    /* Price Block */
                    .price-block {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        padding-bottom: 24px;
                        border-bottom: 1px solid #f0f0f0;
                        margin-bottom: 24px;
                    }
                    .overview-title {
                        font-size: 24px;
                        color: #0A3228;
                        margin-bottom: 8px;
                    }
                    .overview-text {
                        color: #5A5A5A;
                        font-size: 14px;
                        max-width: 400px;
                    }
                    .price {
                        text-align: right;
                    }
                    .price-main {
                        font-size: 28px;
                        font-weight: bold;
                        color: #0A3228;
                    }
                    .price-usd {
                        font-size: 14px;
                        color: #888;
                    }
                    
                    /* Features Grid */
                    .features-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 16px;
                        margin-bottom: 32px;
                    }
                    .feature-card {
                        background: #f9f9f9;
                        border: 1px solid #f0f0f0;
                        border-radius: 12px;
                        padding: 16px;
                        text-align: center;
                    }
                    .feature-icon {
                        width: 24px;
                        height: 24px;
                        margin: 0 auto 8px;
                        color: #0A3228;
                    }
                    .feature-value {
                        font-size: 18px;
                        font-weight: bold;
                        color: #1A1A1A;
                    }
                    .feature-label {
                        font-size: 12px;
                        color: #5A5A5A;
                    }
                    
                    /* Sections */
                    .section {
                        margin-bottom: 32px;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #1A1A1A;
                        margin-bottom: 16px;
                    }
                    .description {
                        color: #5A5A5A;
                        line-height: 1.8;
                        font-size: 14px;
                    }
                    
                    /* Location Box */
                    .location-box {
                        background: #f9f9f9;
                        border: 1px solid #f0f0f0;
                        border-radius: 12px;
                        padding: 20px;
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    .location-icon {
                        color: #0A3228;
                    }
                    .location-text {
                        font-weight: 500;
                        color: #1A1A1A;
                    }
                    .location-country {
                        font-size: 13px;
                        color: #888;
                        margin-top: 4px;
                    }
                    
                    /* Amenities */
                    .amenities-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }
                    .amenity-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px;
                        background: #f9f9f9;
                        border-radius: 8px;
                    }
                    .amenity-icon {
                        color: #9CAF88;
                    }
                    .amenity-text {
                        color: #555;
                        font-size: 14px;
                    }
                    
                    /* Footer */
                    .footer {
                        margin-top: 40px;
                        padding-top: 24px;
                        border-top: 2px solid #0A3228;
                        text-align: center;
                    }
                    .footer-logo {
                        font-size: 20px;
                        font-weight: bold;
                        color: #0A3228;
                        margin-bottom: 8px;
                    }
                    .footer-contact {
                        font-size: 13px;
                        color: #666;
                        line-height: 1.8;
                    }
                    
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .hero { height: 350px; }
                    }
                </style>
            </head>
            <body>
                <!-- Hero Section -->
                <div class="hero">
                    <div class="hero-overlay"></div>
                    <div class="hero-content">
                        <div class="badges">
                            <span class="badge badge-status">${property.status === 'SALE' ? 'For Sale' : 'For Lease'}</span>
                            <span class="badge badge-category">${property.category}</span>
                        </div>
                        <h1 class="hero-title playfair">${property.title}</h1>
                        <div class="hero-location">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>${property.location}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Content Section -->
                <div class="content">
                    <div class="container">
                        <!-- Price Block -->
                        <div class="price-block">
                            <div>
                                <h2 class="overview-title playfair">Property Overview</h2>
                                <p class="overview-text">${property.description.substring(0, 120)}...</p>
                            </div>
                            <div class="price">
                                <div class="price-main">${formatPriceByType(property.priceKes, property.priceType, 'KES')}</div>
                                ${property.priceUsd ? `<div class="price-usd">${formatPriceByType(property.priceUsd, property.priceType, 'USD')}</div>` : ''}
                            </div>
                        </div>
                        
                        <!-- Features Grid -->
                        <div class="features-grid">
                            ${property.bedrooms ? `
                            <div class="feature-card">
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                    <path d="M2 17h20"></path><path d="M6 8v9"></path>
                                </svg>
                                <div class="feature-value">${property.bedrooms}</div>
                                <div class="feature-label">Bedrooms</div>
                            </div>
                            ` : ''}
                            ${property.bathrooms ? `
                            <div class="feature-card">
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                                    <line x1="10" y1="5" x2="8" y2="7"></line><line x1="2" y1="12" x2="22" y2="12"></line>
                                </svg>
                                <div class="feature-value">${property.bathrooms}</div>
                                <div class="feature-label">Bathrooms</div>
                            </div>
                            ` : ''}
                            <div class="feature-card">
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline>
                                    <line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>
                                </svg>
                                <div class="feature-value">${(property.sizeAcres || 0).toLocaleString()}</div>
                                <div class="feature-label">Acres</div>
                            </div>
                            <div class="feature-card">
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <div class="feature-value">Verified</div>
                                <div class="feature-label">Listing</div>
                            </div>
                        </div>
                        
                        <!-- Description -->
                        <div class="section">
                            <h3 class="section-title">Description</h3>
                            <p class="description">${property.description}</p>
                        </div>
                        
                        <!-- Location -->
                        <div class="section">
                            <h3 class="section-title">Location</h3>
                            <div class="location-box">
                                <svg class="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div>
                                    <div class="location-text">${property.location}</div>
                                    <div class="location-country">Kenya</div>
                                </div>
                            </div>
                        </div>
                        
                        ${property.amenities && property.amenities.length > 0 ? `
                        <!-- Amenities -->
                        <div class="section">
                            <h3 class="section-title">Amenities</h3>
                            <div class="amenities-grid">
                                ${property.amenities.map(a => `
                                    <div class="amenity-item">
                                        <svg class="amenity-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        <span class="amenity-text">${a}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- Footer -->
                        <div class="footer">
                            <div class="footer-logo playfair">🏠 Terra Consulting LLC</div>
                            <div class="footer-contact">
                                📞 +254 700 000 000 &nbsp;|&nbsp; 📧 info@terraconsulting.co.ke<br>
                                🌐 www.terraconsulting.co.ke
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
            };
        } else {
            toast.error('Please allow popups to print the brochure');
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[var(--off-white)] rounded-2xl">
            {/* Scrollable Content */}
            <div className="h-full overflow-y-auto no-scrollbar relative">
                {/* Back Button or Close Button */}
                {onClose ? (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                ) : (
                    <button
                        onClick={() => router.back()}
                        className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                )}

                {/* Hero Image / Carousel */}
                <div className="relative h-[50vh] lg:h-[60vh] w-full group">
                    <div
                        className="w-full h-full bg-cover bg-center transition-all duration-500"
                        style={{ backgroundImage: `url(${property.images[currentImageIndex] || '/placeholder.jpg'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Carousel Controls */}
                    {property.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                                {property.images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    <div className="absolute bottom-6 left-6 text-white">
                        <div className="flex gap-2 mb-3">
                            <span className="px-3 py-1 bg-[var(--forest-green)] rounded-full text-xs font-semibold tracking-wide uppercase">
                                {property.status}
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold tracking-wide uppercase">
                                {property.category}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold font-playfair drop-shadow-lg mb-1 text-white">{property.title}</h1>
                        <div className="flex items-center text-gray-100">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{property.location}</span>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white px-6 py-10 min-h-[50vh]">
                    <div className="max-w-4xl mx-auto space-y-10">
                        {/* Title & Price Block */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-2">Property Overview</h2>
                                <p className="text-[var(--text-secondary)] max-w-md">
                                    {property.description.substring(0, 100)}...
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-[var(--forest-green)]">{formatPriceByType(property.priceKes, property.priceType, 'KES')}</p>
                                {property.priceUsd && (
                                    <p className="text-base text-gray-500 font-medium">{formatPriceByType(property.priceUsd, property.priceType, 'USD')}</p>
                                )}
                            </div>
                        </div>

                        {/* Key Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {property.bedrooms && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                    <BedDouble className="w-6 h-6 text-[var(--forest-green)] mb-2" />
                                    <span className="block font-bold text-lg text-gray-900">{property.bedrooms}</span>
                                    <p className="text-sm text-[var(--text-secondary)]">Bedrooms</p>
                                </div>
                            )}
                            {property.bathrooms && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                    <Bath className="w-6 h-6 text-[var(--forest-green)] mb-2" />
                                    <span className="block font-bold text-lg text-gray-900">{property.bathrooms}</span>
                                    <p className="text-sm text-[var(--text-secondary)]">Bathrooms</p>
                                </div>
                            )}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                <Maximize className="w-6 h-6 text-[var(--forest-green)] mb-2" />
                                <span className="block font-bold text-lg text-gray-900">{(property.sizeAcres || 0).toLocaleString()}</span>
                                <p className="text-sm text-[var(--text-secondary)]">Acres</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                                <CheckCircle className="w-6 h-6 text-[var(--forest-green)] mb-2" />
                                <span className="block font-bold text-lg text-gray-900">Verified</span>
                                <p className="text-sm text-[var(--text-secondary)]">Listing</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Description</h3>
                            <div className="prose prose-green max-w-none text-gray-600 leading-relaxed">
                                <p>{property.description}</p>
                            </div>
                        </div>

                        {/* Location Info */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Location</h3>
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-[var(--forest-green)] mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">{property.location}</p>
                                        <p className="text-sm text-gray-500 mt-1">Kenya</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">Amenities</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {property.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <CheckCircle className="w-4 h-4 text-[var(--sage-green)]" />
                                            <span className="text-gray-700">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact CTA */}
                        <div className="bg-[var(--forest-green)] rounded-2xl p-8 text-white">
                            <h4 className="font-bold text-xl mb-2">Interested in this property?</h4>
                            <p className="text-white/80 mb-6">Contact our team to schedule a viewing or request more details.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href={getWhatsAppLink(property)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp flex-1 justify-center"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Chat on WhatsApp
                                </a>
                                <button
                                    onClick={() => setShowLeadForm(true)}
                                    className="flex-1 bg-[var(--marketing-gold)] text-[var(--marketing-green)] py-3 px-6 rounded-xl font-bold hover:bg-[var(--color-gold-light)] transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Send Inquiry
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pb-20">
                            <button
                                onClick={handleShare}
                                className="flex-1 bg-[var(--marketing-green)] text-white py-4 rounded-xl font-bold hover:bg-[var(--color-forest-light)] transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                                {copied ? 'Copied!' : 'Share Listing'}
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex-1 bg-white border-2 border-[var(--marketing-green)] text-[var(--marketing-green)] py-4 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                Print Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showLeadForm && (
                <LeadForm
                    propertyId={property.id}
                    sellerId={property.ownerId}
                    propertyTitle={property.title}
                    onClose={() => setShowLeadForm(false)}
                />
            )}
        </div>
    );
}
