"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PurchaseSchema, PurchaseFormValues } from "./schema"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getPurchases() {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const userId = SHARED_USER_ID

    try {
        const purchases = await prisma.purchase.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
        return { data: purchases }
    } catch (error) {
        console.error("Erreur purchases:", error)
        return { error: "Impossible de récupérer les achats." }
    }
}

export async function createPurchase(values: PurchaseFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = PurchaseSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const userId = SHARED_USER_ID

        const purchase = await prisma.purchase.create({
            data: {
                ...validatedFields.data,
                userId,
            },
        })

        revalidatePath("/purchases")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Achat ajouté !", data: purchase }
    } catch (error) {
        console.error("Erreur purchases:", error)
        return { error: "Erreur lors de l'ajout." }
    }
}

export async function updatePurchase(id: string, values: PurchaseFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = PurchaseSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const updated = await prisma.purchase.updateMany({
            where: { id, userId: SHARED_USER_ID },
            data: {
                ...validatedFields.data,
            },
        })

        if (updated.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/purchases")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Achat mis à jour !" }
    } catch (error) {
        console.error("Erreur purchases:", error)
        return { error: "Erreur lors de la modification." }
    }
}

export async function deletePurchase(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    try {
        const deleted = await prisma.purchase.deleteMany({
            where: { id, userId: SHARED_USER_ID },
        })

        if (deleted.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/purchases")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Achat supprimé !" }
    } catch (error) {
        console.error("Erreur purchases:", error)
        return { error: "Erreur lors de la suppression." }
    }
}
