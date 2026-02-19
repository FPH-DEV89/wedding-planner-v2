const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0";

async function main() {
    console.log("Starting full restoration...");

    // 1. Create Guest Lists
    console.log("Creating Guest Lists...");
    const listCeremonie = await prisma.guestList.create({
        data: { name: "Cérémonie laïque", userId: MOCK_USER_ID }
    });
    const listMairie = await prisma.guestList.create({
        data: { name: "Mairie", userId: MOCK_USER_ID }
    });

    // 2. Import Cérémonie laïque Guests
    const guestDataCeremonie = [
        { name: "El Ivan", relation: "Famille PHILIBERT", category: "Ados" },
        { name: "Mila", relation: "Amis", category: "Ados" },
        { name: "Valentina", relation: "Amis", category: "Ados" },
        { name: "Lorenzo", relation: "Famille SAULNIER", category: "Ados" },
        { name: "Evan", relation: "Famille SAULNIER", category: "Ados" },
        { name: "Monsieur", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Madame", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Yves", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Marie", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Mélanie", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Damien", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Pascal", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Mamé", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Sabine", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Bastien", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Fabien", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Mirielle", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Georges", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Azucena", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Pépé", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Monica", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Manolo", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Eva", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Jonnhy", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "François", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Lilou", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Daniel", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Gérard", relation: "Famille PHILIBERT", category: "Adultes" },
        { name: "Manon", relation: "Amis", category: "Adultes" },
        { name: "Adrien", relation: "Amis", category: "Adultes" },
        { name: "Alan", relation: "Amis", category: "Adultes" },
        { name: "Alice", relation: "Amis", category: "Adultes" },
        { name: "Sabrina", relation: "Amis", category: "Adultes" },
        { name: "Benjamin", relation: "Amis", category: "Adultes" },
        { name: "Camille", relation: "Amis", category: "Adultes" },
        { name: "Axel", relation: "Amis", category: "Adultes" },
        { name: "Nathalie", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Marcel", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Tony", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Kelly", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Mamie", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Alexandre", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Marjorie", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Damien SAULNIER", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Alicia", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "kévin", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Océane", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Aurélie", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Cindy", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Déborah", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Thomas", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Marie-jo", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Hervé", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Pascal SAULNIER", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Céline", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Colleen", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Copain C", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Corentin", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Victor", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Alain", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Fabienne", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Lysiana", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Michel", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Nathalie SAULNIER 2", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Patrick", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Doriane", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Copain D", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Laurie", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Julia", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Nadine", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Cyril", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Micka", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Agathe", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Bérengère", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Eric", relation: "Famille SAULNIER", category: "Adultes" },
        { name: "Angélique", relation: "Amis", category: "Adultes" },
        { name: "Boris", relation: "Prestataire", category: "Adultes" },
        { name: "Stéphanie", relation: "Prestataire", category: "Adultes" },
        { name: "Photographe", relation: "Prestataire", category: "Adultes" },
        { name: "Géraldine", relation: "Prestataire", category: "Adultes" },
        { name: "Nounou 2", relation: "Prestataire", category: "Adultes" },
        { name: "Lana", relation: "Famille PHILIBERT", category: "Enfants" },
        { name: "Léo", relation: "Famille PHILIBERT", category: "Enfants" },
        { name: "Raphaël", relation: "Famille PHILIBERT", category: "Enfants" },
        { name: "Nino", relation: "Famille PHILIBERT", category: "Enfants" },
        { name: "Ivan Philibert", relation: "Famille PHILIBERT", category: "Ados" },
        { name: "Mario", relation: "Famille PHILIBERT", category: "Enfants" },
        { name: "Matia", relation: "Amis", category: "Enfants" },
        { name: "Marius", relation: "Amis", category: "Enfants" },
        { name: "Victoire", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Tess", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Jonas", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Gabyn", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Ella", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Mailys", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Anelya", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Matéo", relation: "Famille SAULNIER", category: "Enfants" },
        { name: "Serveur 1", relation: "Prestataire", category: "Adultes" },
        { name: "Serveur 2", relation: "Prestataire", category: "Adultes" },
        { name: "Grand-père Alicia", relation: "", category: "Adultes" },
        { name: "Grand-mère", relation: "", category: "Adultes" },
    ];
    console.log(`Importing ${guestDataCeremonie.length} guests into Cérémonie laïque...`);
    for (const g of guestDataCeremonie) {
        await prisma.guest.create({
            data: { ...g, userId: MOCK_USER_ID, listId: listCeremonie.id }
        });
    }

    // 3. Import Mairie Guests
    const guestDataMairie = [
        { name: "Mamie", category: "Adulte" },
        { name: "Mamé", category: "Adulte" },
        { name: "Tony", category: "Adulte" },
        { name: "Kelly", category: "Adulte" },
        { name: "Jonas", category: "Enfant" },
        { name: "Mélanie", category: "Adulte" },
        { name: "Damien", category: "Adulte" },
        { name: "Ivan", category: "Enfant" },
        { name: "Nino", category: "Enfant" },
        { name: "Manon", category: "Adulte" },
        { name: "Adrien", category: "Adulte" },
        { name: "Mila", category: "Enfant" },
        { name: "Alice", category: "Adulte" },
        { name: "Alan", category: "Adulte" },
        { name: "Valentina", category: "Enfant" },
        { name: "Marius", category: "Enfant" },
        { name: "Angélique", category: "Adulte" },
        { name: "Pascal", category: "Adulte" },
        { name: "Sabrina", category: "Adulte" },
        { name: "Benjamin", category: "Adulte" },
        { name: "François", category: "Adulte" },
        { name: "Sylvie", category: "Adulte" },
        { name: "Jonathan", category: "Adulte" },
        { name: "Sylvie", category: "Adulte" },
        { name: "Jules", category: "Enfant" },
        { name: "Arthur", category: "Enfant" },
        { name: "Maxime", category: "Enfant" },
        { name: "Nathalie", category: "Adulte" },
        { name: "Robert", category: "Adulte" },
        { name: "Gerard", category: "Adulte" },
        { name: "Nathalie", category: "Adulte" },
        { name: "Marcel", category: "Adulte" },
        { name: "Yves", category: "Adulte" },
        { name: "Marie", category: "Adulte" },
        { name: "Vanessa", category: "Adulte" },
        { name: "Florian", category: "Adulte" },
        { name: "Lana", category: "Enfant" },
        { name: "Raphaël", category: "Enfant" },
        { name: "Léo", category: "Enfant" },
        { name: "Typhaine", category: "Serveur" },
    ];
    console.log(`Importing ${guestDataMairie.length} guests into Mairie...`);
    for (const g of guestDataMairie) {
        await prisma.guest.create({
            data: { ...g, relation: "", userId: MOCK_USER_ID, listId: listMairie.id }
        });
    }

    // 4. Import Purchases
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
    console.log(`Importing ${purchaseData.length} purchases...`);
    for (const p of purchaseData) {
        await prisma.purchase.create({
            data: { ...p, userId: MOCK_USER_ID, isPaid: false }
        });
    }

    console.log("Full restoration completed successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
