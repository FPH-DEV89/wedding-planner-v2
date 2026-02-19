const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const lists = await prisma.guestList.findMany({
        include: {
            _count: {
                select: { guests: true }
            }
        }
    });

    console.log("=== Guest Lists ===");
    lists.forEach(l => {
        console.log(`ID: ${l.id}, Name: "${l.name}", Count: ${l._count.guests}`);
    });

    const totalGuests = await prisma.guest.count();
    console.log(`\nTotal Guests in DB: ${totalGuests}`);

    const guestsNoList = await prisma.guest.count({ where: { listId: null } });
    console.log(`Guests without list: ${guestsNoList}`);

    const sample = await prisma.guest.findMany({ take: 5, include: { guestList: true } });
    console.log("\n=== Sample Guests ===");
    sample.forEach(g => {
        console.log(`Name: ${g.name}, List: ${g.guestList?.name || "NONE"}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
