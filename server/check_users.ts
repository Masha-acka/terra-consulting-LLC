
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                _count: { select: { properties: true } }
            }
        });
        console.log('Users found:', JSON.stringify(users, null, 2));
    } catch (e) {
        console.error('Query failed:', e);
    }
}
main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
