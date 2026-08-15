"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

const ALLOWED_SETTING_KEYS = new Set([
  "wedding_date", "couple_names", "total_budget", "venue", "location",
  "theme_color", "guest_count_target", "notes"
])

export async function getSettings() {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

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
        console.error("Erreur settings:", error)
        return { error: "Impossible de récupérer les réglages." }
    }
}

export async function updateSetting(key: string, value: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    if (!ALLOWED_SETTING_KEYS.has(key)) {
        return { error: "Clé de réglage invalide" }
    }

    if (typeof value !== "string" || value.length > 500) {
        return { error: "Valeur invalide" }
    }

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
        console.error("Erreur settings:", error)
        return { error: "Erreur lors de la mise à jour du réglage." }
    }
}

export async function updateSettings(settings: Record<string, string>) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const userId = SHARED_USER_ID

    try {
        const operations = Object.entries(settings)
            .filter(([k]) => ALLOWED_SETTING_KEYS.has(k))
            .map(([key, value]) => {
                const safeValue = typeof value === "string" ? value.slice(0, 500) : String(value).slice(0, 500)
                return prisma.setting.upsert({
                    where: { key },
                    update: { value: safeValue },
                    create: {
                        key,
                        value: safeValue,
                        userId,
                    },
                })
            })

        if (operations.length > 0) {
            await prisma.$transaction(operations)
        }

        revalidatePath("/")
        revalidatePath("/dashboard")
        return { success: "Réglages mis à jour !" }
    } catch (error) {
        console.error("Erreur settings:", error)
        return { error: "Erreur lors de la mise à jour des réglages." }
    }
}
