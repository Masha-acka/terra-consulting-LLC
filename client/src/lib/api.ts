// API Configuration for Terra Consulting Client
// Switches between local development and production URLs

const isDevelopment = process.env.NODE_ENV === 'development';

// Update this with your actual Render production URL after deployment
const PRODUCTION_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://terra-consulting-api.onrender.com';
const DEVELOPMENT_API_URL = 'http://localhost:5000';

export function getApiUrl(): string {
    return isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;
}

// Property Types
export interface Property {
    id: string;
    title: string;
    description: string;
    priceKes: number;
    priceUsd: number | null;
    category: 'LAND' | 'HOUSE' | 'COMMERCIAL';
    status: 'SALE' | 'LEASE';
    location: string;
    bedrooms: number | null;
    bathrooms: number | null;
    sizeAcres: number | null;
    images: string[];
    amenities: string[];
    titleVerified: boolean;
    ownerId?: string;
    isActive: boolean;
    expiresAt?: string;
    durationDays: number;
    owner?: {
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Fetch all properties
export async function fetchProperties(filters?: {
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
}): Promise<Property[]> {
    const apiUrl = getApiUrl();
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const queryString = params.toString();
    const url = `${apiUrl}/api/properties${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }

    return response.json();
}

// Fetch single property by ID
export async function fetchPropertyById(id: string): Promise<Property> {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/properties/${id}`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch property');
    }

    return response.json();
}

// Format price in Kenyan Shillings
export function formatKES(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format price in USD
export function formatUSD(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Generate WhatsApp link
export function getWhatsAppLink(property: Property): string {
    // Update with your actual WhatsApp number
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000';
    const message = encodeURIComponent(
        `Hi Terra Consulting! I'm interested in the property: "${property.title}" located at ${property.location}. Price: ${formatKES(property.priceKes)}. Please share more details.`
    );
    return `https://wa.me/${phoneNumber}?text=${message}`;
}
