
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'janedow@mail.com';
    const newPassword = 'password123';

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        console.log(`Updated password for ${user.email} to '${newPassword}'`);
    } catch (e) {
        console.error('Failed to update password. User might not exist.', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
