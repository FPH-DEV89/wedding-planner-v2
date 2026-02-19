const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0";

const purchaseData = [
    { type: "Soda", quantity: 80, price: 2.2 },
    { type: "Jus", quantity: 10, price: 2 },
    { type: "Vin rouge", quantity: 20, price: 5.3 },
    { type: "Vin rosé", quantity: 14, price: 5.3 },
    { type: "Vin blanc", quantity: 14, price: 7 },
    { type: "Soupe de champagne", quantity: 1, price: 130 },
    { type: "Gin", quantity: 4, price: 10 },
    { type: "Whisky", quantity: 15, price: 12 },
    { type: "Bières", quantity: 528, price: 0.55 },
    { type: "Vodka", quantity: 2, price: 10 },
    { type: "Cointreau", quantity: 2, price: 15 },
    { type: "Eau", quantity: 100, price: 0.18 },
    { type: "Eau gazeuse", quantity: 90, price: 0.37 },
    { type: "Limoncello", quantity: 5, price: 8 },
    { type: "Get", quantity: 5, price: 6 },
    { type: "Champagne", quantity: 14, price: 15 },
    { type: "Cubis vin rouge", quantity: 5, price: 8 },
    { type: "Cubis vin blanc", quantity: 6, price: 16.9 },
    { type: "Cubis vin rosé", quantity: 6, price: 16.9 },
];

async function main() {
    console.log("Starting Purchase import...");

    console.log(`Importing ${purchaseData.length} purchases...`);

    for (const purchase of purchaseData) {
        await prisma.purchase.create({
            data: {
                type: purchase.type,
                quantity: purchase.quantity,
                price: purchase.price,
                userId: MOCK_USER_ID,
                isPaid: false
            }
        });
    }

    console.log("Import completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
