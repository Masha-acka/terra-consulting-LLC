import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get Saved Properties (Buyer)
router.get('/saved', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const saved = await prisma.savedProperty.findMany({
            where: { userId: req.user!.id },
            include: {
                property: true
            },
            orderBy: { savedAt: 'desc' }
        });

        // Parse JSON fields
        const properties = saved.map(item => ({
            ...item.property,
            images: JSON.parse(item.property.images),
            amenities: JSON.parse(item.property.amenities),
            savedAt: item.savedAt
        }));

        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch saved properties' });
    }
});

// Save Property (Buyer)
router.post('/saved/:propertyId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user!.id;

        await prisma.savedProperty.create({
            data: {
                userId,
                propertyId
            }
        });

        res.json({ message: 'Property saved' });
    } catch (error) {
        // Check if unique constraint failed (already saved)
        res.status(400).json({ error: 'Property already saved or invalid ID' });
    }
});

// Unsave Property (Buyer)
router.delete('/saved/:propertyId', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user!.id;

        await prisma.savedProperty.delete({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        res.json({ message: 'Property removed from saved' });
    } catch (error) {
        res.status(404).json({ error: 'Property not found in saved list' });
    }
});

// Get User's Listings (Seller/Agent/Admin)
router.get('/properties', authenticateToken, requireRole(['SELLER', 'AGENT', 'ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        // If Admin, they probably want to see *their* properties or all?
        // The prompt says "admin to help in uploading new listing".
        // This route finds where ownerId = req.user.id.
        // So this allows Admin to see properties *they* created.
        const properties = await prisma.property.findMany({
            where: { ownerId: req.user!.id },
            orderBy: { createdAt: 'desc' }
        });

        const formattedProperties = properties.map(property => ({
            ...property,
            images: JSON.parse(property.images),
            amenities: JSON.parse(property.amenities),
        }));

        res.json(formattedProperties);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

// Create New Listing (Seller/Agent/Admin)
router.post('/properties', authenticateToken, requireRole(['SELLER', 'AGENT', 'ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const {
            title, description, priceKes, priceUsd, category, status,
            location, lat, lng, bedrooms, bathrooms, sizeAcres,
            images, amenities, durationDays
        } = req.body;

        // Validate required fields (lat/lng are now optional)
        if (!title || !priceKes) {
            res.status(400).json({ error: 'Missing required fields: title, price' });
            return;
        }

        // Calculate expiration date
        const duration = durationDays ? parseInt(durationDays) : 30;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + duration);

        const property = await prisma.property.create({
            data: {
                ownerId: req.user!.id,
                title,
                description: description || '',
                priceKes: parseFloat(priceKes) || 0,
                priceUsd: priceUsd ? parseFloat(priceUsd) : null,
                category: category || 'LAND',
                status: status || 'SALE',
                location: location || 'Unknown',
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                bedrooms: bedrooms ? parseInt(bedrooms) : null,
                bathrooms: bathrooms ? parseInt(bathrooms) : null,
                sizeAcres: sizeAcres ? parseFloat(sizeAcres) : null,
                images: JSON.stringify(images || []),
                amenities: JSON.stringify(amenities || []),
                titleVerified: false, // Default to unverified
                durationDays: duration,
                expiresAt: expiresAt
            }
        });

        res.status(201).json(property);
    } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
});

// Update Listing (Seller/Agent/Admin)
router.put('/properties/:id', authenticateToken, requireRole(['SELLER', 'AGENT', 'ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Check ownership or Admin role
        const existing = await prisma.property.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }

        if (req.user!.role !== 'ADMIN' && existing.ownerId !== req.user!.id) {
            res.status(403).json({ error: 'Not authorized to edit this property' });
            return;
        }

        const {
            title, description, priceKes, priceUsd, category, status,
            location, lat, lng, bedrooms, bathrooms, sizeAcres,
            images, amenities, durationDays
        } = req.body;

        // Calculate new expiration if duration changed
        let expiresAt = existing.expiresAt;
        if (durationDays) {
            const duration = parseInt(durationDays);
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + duration);
        }

        const updated = await prisma.property.update({
            where: { id },
            data: {
                title, description,
                priceKes: parseFloat(priceKes),
                priceUsd: priceUsd ? parseFloat(priceUsd) : null,
                category, status, location,
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                bedrooms: bedrooms ? parseInt(bedrooms) : null,
                bathrooms: bathrooms ? parseInt(bathrooms) : null,
                sizeAcres: sizeAcres ? parseFloat(sizeAcres) : null,
                images: JSON.stringify(images || []),
                amenities: JSON.stringify(amenities || []),
                ...(durationDays && { durationDays: parseInt(durationDays), expiresAt })
            }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update property' });
    }
});

// Delete Listing (Seller/Agent/Admin)
router.delete('/properties/:id', authenticateToken, requireRole(['SELLER', 'AGENT', 'ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Check ownership or Admin role
        const existing = await prisma.property.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }

        if (req.user!.role !== 'ADMIN' && existing.ownerId !== req.user!.id) {
            res.status(403).json({ error: 'Not authorized to delete this property' });
            return;
        }

        await prisma.property.delete({ where: { id } });
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete property' });
    }
});

export default router;
