"use server"

import prisma from "@/lib/prisma"
import { PurchaseSchema, PurchaseFormValues } from "./schema"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getPurchases() {
    const userId = SHARED_USER_ID

    try {
        const purchases = await prisma.purchase.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
        return { data: purchases }
    } catch (error) {
        return { error: "Impossible de récupérer les achats." }
    }
}

export async function createPurchase(values: PurchaseFormValues) {
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
        return { error: "Erreur lors de l'ajout." }
    }
}

export async function updatePurchase(id: string, values: PurchaseFormValues) {
    const validatedFields = PurchaseSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        await prisma.purchase.update({
            where: { id },
            data: {
                ...validatedFields.data,
            },
        })

        revalidatePath("/purchases")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Achat mis à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la modification." }
    }
}

export async function deletePurchase(id: string) {
    try {
        await prisma.purchase.delete({
            where: { id },
        })
        revalidatePath("/purchases")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Achat supprimé !" }
    } catch (error) {
        return { error: "Erreur lors de la suppression." }
    }
}
