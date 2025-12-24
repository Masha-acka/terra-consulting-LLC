import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

// Temporary admin seed endpoint - REMOVE AFTER USE
router.post('/seed-admin', async (req, res) => {
    try {
        const adminEmail = 'admin@terra.co.ke';

        // Check if admin already exists
        const existing = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existing) {
            res.json({
                message: 'Admin user already exists',
                email: adminEmail,
                status: 'already_exists'
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Terra Admin',
                role: 'ADMIN',
                phone: '+254700000000',
            },
        });

        res.json({
            success: true,
            message: 'Admin user created successfully!',
            email: admin.email,
            name: admin.name,
            role: admin.role,
        });
    } catch (error) {
        console.error('Admin seed error:', error);
        res.status(500).json({ error: 'Failed to create admin user', details: String(error) });
    }
});

export default router;
