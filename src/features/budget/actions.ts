"use server"

import prisma from "@/lib/prisma"
import { BudgetSchema, BudgetFormValues } from "./schema"
import { revalidatePath } from "next/cache"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getBudgetItems() {
    try {
        const items = await prisma.budgetItem.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: "desc" },
        })
        return { data: items }
    } catch (error) {
        return { error: "Impossible de récupérer le budget." }
    }
}

export async function createBudgetItem(values: BudgetFormValues) {
    const validatedFields = BudgetSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const item = await prisma.budgetItem.create({
            data: {
                ...validatedFields.data,
                userId: MOCK_USER_ID,
            },
        })

        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Dépense ajoutée !", data: item }
    } catch (error) {
        return { error: "Erreur lors de l'ajout." }
    }
}

export async function deleteBudgetItem(id: string) {
    try {
        await prisma.budgetItem.delete({
            where: { id },
        })
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Dépense supprimée !" }
    } catch (error) {
        return { error: "Erreur lors de la suppression." }
    }
}
