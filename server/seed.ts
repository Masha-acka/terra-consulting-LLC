import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample Kenyan property listings
const properties = [
    {
        title: 'Prime 1/4 Acre Plot in Syokimau',
        description: 'A beautiful quarter-acre plot located in the heart of Syokimau, just 5 minutes from the SGR station. Perfect for residential development with all utilities available. The area is rapidly developing with modern amenities and great infrastructure.',
        priceKes: 12500000,
        priceUsd: 96150,
        category: 'LAND',
        status: 'SALE',
        location: 'Syokimau, Machakos County',
        lat: -1.3558,
        lng: 36.9425,
        bedrooms: null,
        bathrooms: null,
        sizeSqft: 10890,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
            'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800',
            'https://images.unsplash.com/photo-1595877244574-e90ce41ce089?w=800',
        ]),
        amenities: JSON.stringify(['Water Available', 'Electricity Nearby', 'Tarmac Access', 'Title Deed Ready']),
        titleVerified: true,
    },
    {
        title: 'Luxury 3BR Apartment in Kilimani',
        description: 'Stunning modern apartment in the prestigious Kilimani neighborhood. Features high-end finishes, floor-to-ceiling windows, and panoramic city views. Walking distance to Yaya Centre and major amenities. 24/7 security with backup generator.',
        priceKes: 28000000,
        priceUsd: 215400,
        category: 'HOUSE',
        status: 'SALE',
        location: 'Kilimani, Nairobi',
        lat: -1.2886,
        lng: 36.7869,
        bedrooms: 3,
        bathrooms: 2,
        sizeSqft: 2200,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        ]),
        amenities: JSON.stringify(['Swimming Pool', 'Gym', '24/7 Security', 'Backup Generator', 'Parking', 'Balcony']),
        titleVerified: true,
    },
    {
        title: 'Elegant 5BR Mansion in Karen',
        description: 'Exquisite family home set on a lush 1-acre compound in the serene Karen neighborhood. Features include a private garden, staff quarters, modern kitchen, and spacious entertainment areas. Perfect for diplomatic or executive families seeking privacy and luxury.',
        priceKes: 95000000,
        priceUsd: 731000,
        category: 'HOUSE',
        status: 'SALE',
        location: 'Karen, Nairobi',
        lat: -1.3226,
        lng: 36.7114,
        bedrooms: 5,
        bathrooms: 4,
        sizeSqft: 6500,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        ]),
        amenities: JSON.stringify(['Swimming Pool', 'Garden', 'Staff Quarters', 'Garage', 'Borehole', 'Solar Backup']),
        titleVerified: true,
    },
    {
        title: 'Prime Office Space in Westlands',
        description: 'Modern open-plan office space in the bustling Westlands commercial district. Located in a Grade A building with excellent natural lighting, fiber optic internet, and ample parking. Ideal for tech companies, consultancies, or creative agencies.',
        priceKes: 250000,
        priceUsd: 1923,
        category: 'COMMERCIAL',
        status: 'LEASE',
        location: 'Westlands, Nairobi',
        lat: -1.2674,
        lng: 36.8110,
        bedrooms: null,
        bathrooms: 2,
        sizeSqft: 3500,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
        ]),
        amenities: JSON.stringify(['High-Speed Internet', 'Parking', 'Reception', 'Meeting Rooms', '24/7 Access', 'Air Conditioning']),
        titleVerified: true,
    },
    {
        title: '5 Acres Agricultural Land in Kitengela',
        description: 'Expansive agricultural land perfect for farming or investment purposes. Located along the Namanga road with easy access. The land has rich red soil suitable for various crops or livestock farming. Great potential for future subdivision and development.',
        priceKes: 45000000,
        priceUsd: 346150,
        category: 'LAND',
        status: 'SALE',
        location: 'Kitengela, Kajiado County',
        lat: -1.4711,
        lng: 36.9611,
        bedrooms: null,
        bathrooms: null,
        sizeSqft: 217800,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800',
            'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
            'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
        ]),
        amenities: JSON.stringify(['Borehole Potential', 'Electricity Nearby', 'All-Weather Road', 'Title Deed']),
        titleVerified: false,
    },
];

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.property.deleteMany();
    console.log('📭 Cleared existing properties');

    // Insert sample properties
    for (const property of properties) {
        const created = await prisma.property.create({
            data: property,
        });
        console.log(`✅ Created: ${created.title}`);
    }

    console.log(`\n🎉 Seeded ${properties.length} properties successfully!`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
