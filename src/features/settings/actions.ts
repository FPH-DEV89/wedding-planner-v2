"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getSettings() {
    const userId = SHARED_USER_ID

    try {
        const settings = await prisma.setting.findMany({
            where: { userId },
        })

        // Convert to a more usable object format
        const settingsMap = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value
            return acc
        }, {} as Record<string, string>)

        return { data: settingsMap }
    } catch (error) {
        return { error: "Impossible de récupérer les réglages." }
    }
}

export async function updateSetting(key: string, value: string) {
    const userId = SHARED_USER_ID

    try {
        await prisma.setting.upsert({
            where: { key },
            update: { value },
            create: {
                key,
                value,
                userId,
            },
        })

        revalidatePath("/")
        revalidatePath("/dashboard")
        return { success: "Réglage mis à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour du réglage." }
    }
}

export async function updateSettings(settings: Record<string, string>) {
    const userId = SHARED_USER_ID

    try {
        const operations = Object.entries(settings).map(([key, value]) =>
            prisma.setting.upsert({
                where: { key },
                update: { value },
                create: {
                    key,
                    value,
                    userId,
                },
            })
        )

        await prisma.$transaction(operations)

        revalidatePath("/")
        revalidatePath("/dashboard")
        return { success: "Réglages mis à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour des réglages." }
    }
}
