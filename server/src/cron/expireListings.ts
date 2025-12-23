
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function expireListings() {
    try {
        const now = new Date();

        // Find active properties that have expired
        const expiredProperties = await prisma.property.updateMany({
            where: {
                isActive: true,
                expiresAt: {
                    lt: now
                }
            },
            data: {
                isActive: false
            }
        });

        if (expiredProperties.count > 0) {
            console.log(`Auto-expired ${expiredProperties.count} listings at ${now.toISOString()}`);
        }
    } catch (error) {
        console.error('Error running expiration job:', error);
    }
}

// Run every hour
export function startExpirationJob() {
    // Run immediately on startup
    expireListings();

    // Set interval (1 hour = 3600000 ms)
    setInterval(expireListings, 3600000);
}
