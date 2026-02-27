const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

async function main() {
    const settings = [
        { key: "wedding_date", value: "2026-09-12" },
        { key: "wedding_names", value: "Florian & Vanessa" },
        { key: "wedding_location", value: "Château de la Mariée, France" },
    ]

    console.log("Seeding settings...")

    for (const setting of settings) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: {
                ...setting,
                userId: SHARED_USER_ID
            }
        })
    }

    console.log("Seeding finished.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
