const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0";

async function main() {
    try {
        const user = await prisma.user.upsert({
            where: { id: MOCK_USER_ID },
            update: {},
            create: {
                id: MOCK_USER_ID,
                name: "Test User",
                email: "test@example.com",
            },
        });
        console.log('USER_SEEDED:', user.id);
    } catch (error) {
        console.error('SEED_ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
