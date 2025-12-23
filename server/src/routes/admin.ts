import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get All Users
router.get('/users', authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { properties: true } } }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Toggle User Status (Enable/Disable)
router.patch('/users/:id/status', authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { isActive },
            select: { id: true, name: true, isActive: true }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Get All Properties (Admin View)
router.get('/properties', authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const properties = await prisma.property.findMany({
            include: { owner: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON
        const formatted = properties.map(p => ({
            ...p,
            images: JSON.parse(p.images),
            amenities: JSON.parse(p.amenities)
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Extend/Expire Property
router.post('/properties/:id/expire', authenticateToken, requireRole(['ADMIN']), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { action, durationDays } = req.body; // action: 'extend' | 'expire'

        if (action === 'expire') {
            await prisma.property.update({
                where: { id },
                data: { isActive: false, expiresAt: new Date() } // Expire now
            });
            res.json({ message: 'Property expired' });
        } else {
            // Extend
            const info = await prisma.property.findUnique({ where: { id } });
            const days = durationDays || info?.durationDays || 30;

            const newExpiry = new Date();
            newExpiry.setDate(newExpiry.getDate() + days);

            await prisma.property.update({
                where: { id },
                data: { isActive: true, expiresAt: newExpiry, durationDays: days }
            });
            res.json({ message: `Property extended by ${days} days` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to modify expiration' });
    }
});

export default router;
