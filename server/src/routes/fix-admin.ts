import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

// Force reset admin password
router.get('/fix-admin', async (req, res) => {
    try {
        const email = 'admin@terra.co.ke';
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        // Upsert: Update if exists, Create if not
        const admin = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'ADMIN', // Ensure role is ADMIN
                name: 'Terra Admin'
            },
            create: {
                email,
                password: hashedPassword,
                name: 'Terra Admin',
                role: 'ADMIN',
                phone: '+254700000000',
            }
        });

        res.json({
            success: true,
            message: 'Admin password reset to: Admin@123',
            user: { email: admin.email, role: admin.role, id: admin.id }
        });
    } catch (error) {
        console.error('Fix admin error:', error);
        res.status(500).json({ error: 'Failed to reset admin', details: String(error) });
    }
});

export default router;
