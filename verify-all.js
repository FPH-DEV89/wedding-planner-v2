const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0";

async function verify() {
    console.log('--- DEBUT VERIFICATION ---');

    try {
        // 1. Guest List
        console.log('1. Test Guest List...');
        const list = await prisma.guestList.create({
            data: { name: "Liste Test QA", userId: MOCK_USER_ID }
        });
        console.log('   OK: Liste créée ID:', list.id);

        // 2. Guest
        console.log('2. Test Guest...');
        const guest = await prisma.guest.create({
            data: {
                name: "Invité Test QA",
                status: "PENDING",
                listId: list.id,
                userId: MOCK_USER_ID
            }
        });
        console.log('   OK: Invité créé ID:', guest.id);

        // 3. Vendor
        console.log('3. Test Vendor...');
        const vendor = await prisma.vendor.create({
            data: {
                name: "Prestataire Test QA",
                category: "Traiteur",
                status: "RESEARCH",
                price: 1000,
                paidAmount: 200,
                userId: MOCK_USER_ID
            }
        });
        console.log('   OK: Prestataire créé ID:', vendor.id);

        // 4. Purchase
        console.log('4. Test Purchase...');
        const purchase = await prisma.purchase.create({
            data: {
                name: "Achat Test QA",
                price: 50,
                isPaid: true,
                userId: MOCK_USER_ID
            }
        });
        console.log('   OK: Achat créé ID:', purchase.id);

        // 5. Task
        console.log('5. Test Task...');
        const task = await prisma.task.create({
            data: {
                title: "Tâche Test QA",
                status: "TODO",
                userId: MOCK_USER_ID
            }
        });
        console.log('   OK: Tâche créée ID:', task.id);

        console.log('\n--- NETTOYAGE DES DONNEES DE TEST ---');
        await prisma.task.delete({ where: { id: task.id } });
        await prisma.purchase.delete({ where: { id: purchase.id } });
        await prisma.vendor.delete({ where: { id: vendor.id } });
        await prisma.guest.delete({ where: { id: guest.id } });
        await prisma.guestList.delete({ where: { id: list.id } });
        console.log('OK: Données de test supprimées.');

    } catch (error) {
        console.error('ERREUR LORS DU TEST:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
