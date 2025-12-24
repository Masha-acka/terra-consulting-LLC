import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Temporary seed endpoint - REMOVE AFTER USE
router.post('/seed-properties', async (req, res) => {
    try {
        // Clear existing properties first
        await prisma.property.deleteMany();

        const properties = [
            // LAND - Kiambu County (8 properties)
            {
                title: 'Prime 1/2 Acre Plot in Ruiru',
                description: 'Excellent residential plot along Ruiru-Kimbo road. Ready title deed, electricity and water available. Perfect for building your dream home. Walking distance to schools and shopping centers.',
                priceKes: 8500000,
                priceUsd: 65400,
                category: 'LAND',
                status: 'SALE',
                location: 'Ruiru, Kiambu County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 0.5, // 1/2 Acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
                    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800'
                ]),
                amenities: JSON.stringify(['Water Available', 'Electricity', 'Tarmac Access', 'Title Deed Ready', 'Near Schools']),
                titleVerified: true,
            },
            {
                title: '1/4 Acre Plot in Juja Farm',
                description: 'Affordable residential plot in the fast-growing Juja area. Near JKUAT University. Great investment opportunity with potential for appreciation. All legal documents in order.',
                priceKes: 3200000,
                priceUsd: 24600,
                category: 'LAND',
                status: 'SALE',
                location: 'Juja Farm, Kiambu County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 0.25, // 1/4 Acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1595877244574-e90ce41ce089?w=800',
                    'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800'
                ]),
                amenities: JSON.stringify(['Electricity Nearby', 'Murram Road', 'Title Deed', 'Near University']),
                titleVerified: true,
            },
            {
                title: '5 Acres Agricultural Land in Limuru',
                description: 'Rich volcanic soil perfect for farming. Ideal for coffee, tea, or vegetable farming. Gentle slope with natural water springs. Beautiful views of the escarpment.',
                priceKes: 75000000,
                priceUsd: 577000,
                category: 'LAND',
                status: 'SALE',
                location: 'Limuru, Kiambu County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 5, // 5 Acres
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
                    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'
                ]),
                amenities: JSON.stringify(['Natural Spring', 'Rich Soil', 'All-Weather Road', 'Title Deed', 'Near Limuru Town']),
                titleVerified: true,
            },
            {
                title: '1/8 Acre in Thika Town',
                description: 'Strategic plot near Thika Superhighway exit. Close to Blue Post Hotel. Suitable for residential or commercial development. Growing area with excellent infrastructure.',
                priceKes: 6000000,
                priceUsd: 46150,
                category: 'LAND',
                status: 'SALE',
                location: 'Thika Town, Kiambu County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 0.125, // 1/8 Acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
                ]),
                amenities: JSON.stringify(['Water', 'Electricity', 'Tarmac Road', 'Title Deed', 'Near CBD']),
                titleVerified: true,
            },
            // LAND - Nairobi County (4 properties)
            {
                title: '1/4 Acre Prime Plot in Kangundo Road',
                description: 'Exclusive residential plot in the upcoming Kangundo Road corridor. Gated community with shared amenities. Perfect for building a modern family home.',
                priceKes: 15000000,
                priceUsd: 115400,
                category: 'LAND',
                status: 'SALE',
                location: 'Kangundo Road, Nairobi County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 0.25, // 1/4 Acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800',
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
                ]),
                amenities: JSON.stringify(['Gated Community', 'Tarmac Access', 'Title Deed', 'Water & Electricity']),
                titleVerified: true,
            },
            {
                title: '50x100 Plot in Kasarani',
                description: 'Well-located plot in Kasarani area near Safari Park Hotel. Flat terrain ready for immediate construction. Ideal for residential or rental apartments.',
                priceKes: 9500000,
                priceUsd: 73100,
                category: 'LAND',
                status: 'SALE',
                location: 'Kasarani, Nairobi County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 0.115, // 50x100 ft ≈ 0.115 Acres
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1595877244574-e90ce41ce089?w=800'
                ]),
                amenities: JSON.stringify(['Flat Terrain', 'Near ICIPE', 'Title Deed', 'Electricity Available']),
                titleVerified: true,
            },
            // LAND - Murang'a County (3 properties)
            {
                title: '2 Acres in Kenol Town',
                description: 'Commercial land along Thika-Murang\'a highway. High visibility location perfect for petrol station, shopping complex, or warehousing. Ready documents.',
                priceKes: 35000000,
                priceUsd: 269200,
                category: 'LAND',
                status: 'SALE',
                location: 'Kenol, Murang\'a County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 2, // 2 Acres
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800',
                    'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800'
                ]),
                amenities: JSON.stringify(['Highway Frontage', 'Commercial Zone', 'Title Deed', 'Water & Electricity']),
                titleVerified: true,
            },
            {
                title: '10 Acres Farm in Maragua',
                description: 'Productive agricultural land in the heart of Murang\'a. Currently under fruit farming. Includes farmhouse and workers quarters. River frontage for irrigation.',
                priceKes: 45000000,
                priceUsd: 346200,
                category: 'LAND',
                status: 'SALE',
                location: 'Maragua, Murang\'a County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 10, // 10 Acres
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
                    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
                ]),
                amenities: JSON.stringify(['River Frontage', 'Farmhouse', 'Workers Quarters', 'Fruit Trees', 'Title Deed']),
                titleVerified: true,
            },
            {
                title: '1/2 Acre Plot in Murang\'a Town',
                description: 'Residential plot with stunning views of Mt. Kenya. Quiet neighborhood with good security. Near county headquarters and amenities.',
                priceKes: 4500000,
                priceUsd: 34600,
                category: 'LAND',
                status: 'SALE',
                location: 'Murang\'a Town, Murang\'a County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 0.5, // 1/2 Acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1595877244574-e90ce41ce089?w=800'
                ]),
                amenities: JSON.stringify(['Mountain Views', 'Near Town', 'Title Deed', 'Electricity']),
                titleVerified: true,
            },
            // HOUSES - Kiambu (2 properties)
            {
                title: 'Modern 4BR House in Runda Mimosa',
                description: 'Stunning contemporary home in exclusive Runda Mimosa estate. Open-plan living, modern kitchen, master en-suite with walk-in closet. Landscaped garden with mature trees.',
                priceKes: 85000000,
                priceUsd: 653900,
                category: 'HOUSE',
                status: 'SALE',
                location: 'Runda Mimosa, Kiambu County',
                bedrooms: 4,
                bathrooms: 3,
                sizeSqft: 0.5, // Half acre compound
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
                ]),
                amenities: JSON.stringify(['Swimming Pool', 'Garden', 'Staff Quarters', 'Garage', 'Solar Backup', '24/7 Security']),
                titleVerified: true,
            },
            {
                title: '3BR Townhouse in Kiambu Road',
                description: 'Elegant townhouse in a gated community. Modern finishes, spacious rooms, and private parking. Close to Village Market and major highways.',
                priceKes: 28000000,
                priceUsd: 215400,
                category: 'HOUSE',
                status: 'SALE',
                location: 'Kiambu Road, Kiambu County',
                bedrooms: 3,
                bathrooms: 2,
                sizeSqft: 0.125, // 1/8 acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
                ]),
                amenities: JSON.stringify(['Gated Community', 'Parking', 'Garden', 'Fiber Internet', 'Backup Generator']),
                titleVerified: true,
            },
            // HOUSES - Nairobi (2 properties)
            {
                title: 'Luxury 5BR Mansion in Karen (1 Acre)',
                description: 'Exquisite family home on a 1-acre compound. Features include infinity pool, home theater, wine cellar, and smart home automation. Perfect for diplomatic or executive families.',
                priceKes: 195000000,
                priceUsd: 1500000,
                category: 'HOUSE',
                status: 'SALE',
                location: 'Karen, Nairobi County',
                bedrooms: 5,
                bathrooms: 6,
                sizeSqft: 1, // 1 Acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
                ]),
                amenities: JSON.stringify(['Infinity Pool', 'Home Theater', 'Wine Cellar', 'Smart Home', 'Staff Quarters', 'Borehole']),
                titleVerified: true,
            },
            {
                title: '3BR Apartment in Kilimani',
                description: 'Modern apartment in prime Kilimani location. High-end finishes, open kitchen, and spacious balcony with city views. Walking distance to Yaya Centre.',
                priceKes: 18500000,
                priceUsd: 142300,
                category: 'HOUSE',
                status: 'SALE',
                location: 'Kilimani, Nairobi County',
                bedrooms: 3,
                bathrooms: 2,
                sizeSqft: 0.05, // Apartment plot share
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
                ]),
                amenities: JSON.stringify(['Gym', 'Swimming Pool', 'Parking', 'Balcony', '24/7 Security', 'Elevator']),
                titleVerified: true,
            },
            // COMMERCIAL - Mixed (3 properties)
            {
                title: 'Prime Office Space in Westlands',
                description: 'Grade A office space in the heart of Westlands business district. Fully fitted with partitions, AC, and fiber internet. Ample parking available.',
                priceKes: 350000,
                priceUsd: 2690,
                category: 'COMMERCIAL',
                status: 'LEASE',
                location: 'Westlands, Nairobi County',
                bedrooms: null,
                bathrooms: 2,
                sizeSqft: 0.1, // Commercial space
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
                ]),
                amenities: JSON.stringify(['High-Speed Internet', 'Parking', 'Reception', 'Meeting Rooms', '24/7 Access', 'Air Conditioning']),
                titleVerified: true,
            },
            {
                title: 'Retail Shop in Thika Town',
                description: 'Ground floor retail space in busy Thika commercial area. High foot traffic location. Suitable for supermarket, electronics, or fashion store.',
                priceKes: 85000,
                priceUsd: 650,
                category: 'COMMERCIAL',
                status: 'LEASE',
                location: 'Thika Town, Kiambu County',
                bedrooms: null,
                bathrooms: 1,
                sizeSqft: 0.03, // Small retail
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
                ]),
                amenities: JSON.stringify(['High Foot Traffic', 'Display Windows', 'Storage Room', 'Toilet Facilities']),
                titleVerified: true,
            },
            {
                title: 'Warehouse in Industrial Area (0.5 Acres)',
                description: 'Modern warehouse facility with loading bays and high ceiling. Ideal for logistics, manufacturing, or storage. Near Mombasa Road for easy access.',
                priceKes: 750000,
                priceUsd: 5770,
                category: 'COMMERCIAL',
                status: 'LEASE',
                location: 'Industrial Area, Nairobi County',
                bedrooms: null,
                bathrooms: 4,
                sizeSqft: 0.5, // 0.5 Acres
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
                ]),
                amenities: JSON.stringify(['Loading Bays', '24/7 Security', 'Office Space', 'Parking', 'Fire Safety System']),
                titleVerified: true,
            },
            // LAND - Additional Kiambu plots (2 more for emphasis)
            {
                title: '1/4 Acre in Kikuyu Town',
                description: 'Prime residential plot in controlled development area. Near Kikuyu town center with all amenities. Excellent for investment or owner occupation.',
                priceKes: 7500000,
                priceUsd: 57700,
                category: 'LAND',
                status: 'SALE',
                location: 'Kikuyu Town, Kiambu County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 0.25, // 1/4 Acre
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
                ]),
                amenities: JSON.stringify(['Near Town', 'Controlled Area', 'Title Deed', 'Tarmac Access']),
                titleVerified: true,
            },
            {
                title: '3 Acres Coffee Land in Kiambaa',
                description: 'Beautiful coffee farm land with mature trees. Great income potential while holding for future development. Clean title and clear access.',
                priceKes: 55000000,
                priceUsd: 423100,
                category: 'LAND',
                status: 'SALE',
                location: 'Kiambaa, Kiambu County',
                bedrooms: null,
                bathrooms: null,
                sizeSqft: 3, // 3 Acres
                images: JSON.stringify([
                    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
                    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'
                ]),
                amenities: JSON.stringify(['Coffee Farm', 'Mature Trees', 'Title Deed', 'Good Soil', 'Near Banana Hill']),
                titleVerified: true,
            },
        ];

        // Insert all properties
        for (const property of properties) {
            await prisma.property.create({
                data: property as any,
            });
        }

        res.json({
            success: true,
            message: `Successfully seeded ${properties.length} properties!`,
            breakdown: {
                land: 15,
                houses: 4,
                commercial: 3,
                kiambu: 10,
                nairobi: 6,
                muranga: 3
            }
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Failed to seed database', details: String(error) });
    }
});

export default router;
