import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Track a property view (public endpoint)
router.post('/track', async (req: Request, res: Response) => {
    try {
        const { propertyId, visitorId, userId } = req.body;

        if (!propertyId) {
            return res.status(400).json({ error: 'Property ID is required' });
        }

        // Check if property exists
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Create view record
        const view = await prisma.propertyView.create({
            data: {
                propertyId,
                visitorId: visitorId || null,
                userId: userId || null,
                ipAddress: req.ip || req.socket.remoteAddress || null,
                userAgent: req.get('User-Agent') || null
            }
        });

        res.status(201).json({ success: true, viewId: view.id });
    } catch (error) {
        console.error('Error tracking view:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
});

// Get analytics overview (admin/seller only)
router.get('/overview', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Build where clause based on user role
        let propertyFilter: any = {};
        if (user.role === 'SELLER' || user.role === 'AGENT') {
            propertyFilter = { ownerId: user.id };
        }
        // Admin sees all properties

        // Get property IDs for the filter
        const properties = await prisma.property.findMany({
            where: propertyFilter,
            select: { id: true, title: true }
        });
        const propertyIds = properties.map(p => p.id);

        // Get view counts
        const [totalViews, todayViews, weekViews, monthViews, uniqueVisitors] = await Promise.all([
            prisma.propertyView.count({
                where: { propertyId: { in: propertyIds } }
            }),
            prisma.propertyView.count({
                where: {
                    propertyId: { in: propertyIds },
                    createdAt: { gte: todayStart }
                }
            }),
            prisma.propertyView.count({
                where: {
                    propertyId: { in: propertyIds },
                    createdAt: { gte: weekStart }
                }
            }),
            prisma.propertyView.count({
                where: {
                    propertyId: { in: propertyIds },
                    createdAt: { gte: monthStart }
                }
            }),
            prisma.propertyView.groupBy({
                by: ['visitorId'],
                where: {
                    propertyId: { in: propertyIds },
                    visitorId: { not: null }
                }
            }).then(groups => groups.length)
        ]);

        // Get most viewed properties
        const propertyViewCounts = await prisma.propertyView.groupBy({
            by: ['propertyId'],
            where: { propertyId: { in: propertyIds } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        });

        const topProperties = await Promise.all(
            propertyViewCounts.map(async (pv) => {
                const property = await prisma.property.findUnique({
                    where: { id: pv.propertyId },
                    select: { id: true, title: true, location: true, images: true }
                });
                return {
                    ...property,
                    viewCount: pv._count.id,
                    images: property?.images ? JSON.parse(property.images) : []
                };
            })
        );

        // Get recent views
        const recentViews = await prisma.propertyView.findMany({
            where: { propertyId: { in: propertyIds } },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                property: {
                    select: { id: true, title: true, location: true }
                }
            }
        });

        res.json({
            overview: {
                totalViews,
                todayViews,
                weekViews,
                monthViews,
                uniqueVisitors,
                totalProperties: properties.length
            },
            topProperties,
            recentViews: recentViews.map(v => ({
                id: v.id,
                propertyId: v.propertyId,
                propertyTitle: v.property.title,
                propertyLocation: v.property.location,
                viewedAt: v.createdAt,
                visitorId: v.visitorId
            }))
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Get views for a specific property
router.get('/property/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const propertyId = req.params.id;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check property ownership for sellers
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        if (user.role !== 'ADMIN' && property.ownerId !== user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const now = new Date();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get daily view counts for the past 7 days
        const views = await prisma.propertyView.findMany({
            where: {
                propertyId,
                createdAt: { gte: weekStart }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by day
        const dailyViews: { [key: string]: number } = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const key = date.toISOString().split('T')[0];
            dailyViews[key] = 0;
        }

        views.forEach(v => {
            const key = v.createdAt.toISOString().split('T')[0];
            if (dailyViews[key] !== undefined) {
                dailyViews[key]++;
            }
        });

        const totalViews = await prisma.propertyView.count({
            where: { propertyId }
        });

        res.json({
            propertyId,
            totalViews,
            weeklyViews: views.length,
            dailyBreakdown: Object.entries(dailyViews)
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => a.date.localeCompare(b.date))
        });
    } catch (error) {
        console.error('Error fetching property analytics:', error);
        res.status(500).json({ error: 'Failed to fetch property analytics' });
    }
});

export default router;
