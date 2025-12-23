
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@terraconsulting.com';
    const password = 'admin123!@#'; // Change this in production!

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({ where: { email } });

    if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN',
            phone: '0000000000'
        },
    });

    console.log(`Admin user created: ${admin.email}`);

    // Set expiration for existing properties
    const properties = await prisma.property.findMany({ where: { expiresAt: null } });

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setDate(now.getDate() + 30);

    for (const prop of properties) {
        await prisma.property.update({
            where: { id: prop.id },
            data: {
                expiresAt: nextMonth,
                isActive: true
            }
        });
    }
    console.log(`Updated expiration for ${properties.length} existing properties.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
