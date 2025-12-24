import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

// Temporary user seed endpoint - REMOVE AFTER USE
router.post('/seed-users', async (req, res) => {
    try {
        const users = [
            {
                email: 'mbugua@terra.co.ke',
                password: 'Mbugua@123',
                name: 'Mbugua',
                role: 'SELLER',
                phone: '+254700000001',
            },
            {
                email: 'gitau@terra.co.ke',
                password: 'Gitau@123',
                name: 'Gitau',
                role: 'SELLER',
                phone: '+254700000002',
            },
        ];

        const createdUsers = [];

        for (const user of users) {
            // Check if user already exists
            const existing = await prisma.user.findUnique({
                where: { email: user.email }
            });

            if (existing) {
                createdUsers.push({ email: user.email, status: 'already exists' });
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Create user
            const created = await prisma.user.create({
                data: {
                    email: user.email,
                    password: hashedPassword,
                    name: user.name,
                    role: user.role,
                    phone: user.phone,
                },
            });

            createdUsers.push({ email: created.email, name: created.name, role: created.role, status: 'created' });
        }

        res.json({
            success: true,
            message: `Processed ${users.length} users`,
            users: createdUsers,
        });
    } catch (error) {
        console.error('User seed error:', error);
        res.status(500).json({ error: 'Failed to seed users', details: String(error) });
    }
});

export default router;
