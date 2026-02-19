const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0";

async function main() {
    console.log("=== Action Simulation ===");

    const guests = await prisma.guest.findMany({
        where: { userId: MOCK_USER_ID },
        orderBy: { createdAt: "desc" },
    });
    console.log(`Guests fetched: ${guests.length}`);

    const lists = await prisma.guestList.findMany({
        where: { userId: MOCK_USER_ID },
        include: {
            _count: {
                select: { guests: true }
            }
        }
    });
    console.log(`Lists fetched: ${lists.length}`);
    lists.forEach(l => {
        console.log(`List: ${l.name}, Count: ${l._count.guests}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
