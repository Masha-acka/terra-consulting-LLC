import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import leadsRoutes from './routes/leads';
import { startExpirationJob } from './cron/expireListings';

// Load environment variables
dotenv.config();

// Start Background Jobs
startExpirationJob();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Parse allowed origins from environment
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || ['http://localhost:3000'];

// CORS Configuration
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Check if allowed origin
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow any Vercel deployment (Production & Preview)
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        console.log('❌ CSS Blocked Origin:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
import uploadRoutes from './routes/upload';
import path from 'path';

// ...

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leads', leadsRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all properties
app.get('/api/properties', async (req: Request, res: Response) => {
    try {
        const { category, status, minPrice, maxPrice } = req.query;

        const where: any = {
            isActive: true, // Only show active listings
            ...(category ? { category: String(category) } : {}),
            ...(status ? { status: String(status) } : {}),
            ...(minPrice || maxPrice ? {
                priceKes: {
                    ...(minPrice ? { gte: Number(minPrice) } : {}),
                    ...(maxPrice ? { lte: Number(maxPrice) } : {})
                }
            } : {})
        };

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON fields for response
        const formattedProperties = properties.map(property => ({
            ...property,
            images: JSON.parse(property.images),
            amenities: JSON.parse(property.amenities),
        }));

        res.json(formattedProperties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Get single property by ID
app.get('/api/properties/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }

        // Parse JSON fields for response
        const formattedProperty = {
            ...property,
            images: JSON.parse(property.images),
            amenities: JSON.parse(property.amenities),
        };

        res.json(formattedProperty);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Failed to fetch property' });
    }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Terra Consulting API running on http://localhost:${PORT}`);
    console.log(`📍 Allowed origins: ${allowedOrigins.join(', ')}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
