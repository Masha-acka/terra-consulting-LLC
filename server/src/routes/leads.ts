import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Create a new lead (Public or authenticated)
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, message, propertyId, sellerId } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        let derivedSellerId = sellerId;

        // If propertyId provided but no sellerId, fetch owner from property
        if (propertyId && !derivedSellerId) {
            const property = await prisma.property.findUnique({ where: { id: propertyId } });
            if (property && property.ownerId) {
                derivedSellerId = property.ownerId;
            }
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                message,
                propertyId: propertyId || null,
                sellerId: derivedSellerId || null,
                status: 'NEW'
            }
        });

        res.status(201).json(lead);
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

// Get leads for a logged-in seller
router.get('/seller', authenticateToken, requireRole(['SELLER', 'AGENT', 'ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        // Admin sees all, Seller sees own
        const where = req.user?.role === 'ADMIN' ? {} : { sellerId: userId };

        const leads = await prisma.lead.findMany({
            where,
            include: {
                property: { select: { title: true, location: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// Update lead status (Seller/Admin)
router.patch('/:id/status', authenticateToken, requireRole(['SELLER', 'AGENT', 'ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;

        // Verify ownership (or admin)
        const lead = await prisma.lead.findUnique({ where: { id } });

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        if (req.user?.role !== 'ADMIN' && lead.sellerId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: { status }
        });

        res.json(updatedLead);
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ error: 'Failed to update lead status' });
    }
});

export default router;
