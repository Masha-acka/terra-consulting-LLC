import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

// Debug and Fix Admin Route
router.get('/debug-admin', async (req, res) => {
    try {
        const email = 'admin@terra.co.ke';
        const password = 'Admin@123';

        // 1. Check if user exists
        let user = await prisma.user.findUnique({
            where: { email }
        });

        let action = '';
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!user) {
            // Create if missing
            action = 'Created new admin user';
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: 'Terra Admin',
                    role: 'ADMIN',
                    phone: '+254700000000'
                }
            });
        } else {
            // Force update password
            action = 'Updated existing admin password';
            user = await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    role: 'ADMIN', // Ensure role
                    isActive: true
                }
            });
        }

        res.json({
            success: true,
            action,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            },
            message: `Password successfully set to: ${password}`
        });

    } catch (error) {
        console.error('Debug admin error:', error);
        res.status(500).json({ error: 'Failed to debug admin', details: String(error) });
    }
});

export default router;
