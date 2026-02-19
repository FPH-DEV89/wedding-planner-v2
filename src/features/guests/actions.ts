"use server"

import prisma from "@/lib/prisma"
import { GuestSchema, GuestFormValues } from "./schema"
import { revalidatePath } from "next/cache"

// Mock User ID for now until Auth is fully wired up
const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getGuests(listId?: string) {
    try {
        const guests = await prisma.guest.findMany({
            where: {
                userId: MOCK_USER_ID,
                ...(listId ? { listId } : {})
            },
            orderBy: { createdAt: "desc" },
        })
        return { data: guests }
    } catch (error) {
        return { error: "Impossible de récupérer les invités." }
    }
}

export async function createGuest(values: GuestFormValues) {
    const validatedFields = GuestSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const { listId, ...rest } = validatedFields.data

        const guest = await prisma.guest.create({
            data: {
                ...rest,
                listId: listId || null,
                userId: MOCK_USER_ID,
            },
        })

        revalidatePath("/guests")
        revalidatePath("/dashboard")
        return { success: "Invité ajouté !", data: guest }
    } catch (error) {
        console.error(error)
        return { error: "Erreur lors de la création de l'invité." }
    }
}

export async function updateGuest(id: string, values: GuestFormValues) {
    const validatedFields = GuestSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const { listId, ...rest } = validatedFields.data

        await prisma.guest.update({
            where: { id },
            data: {
                ...rest,
                listId: listId || null,
            },
        })

        revalidatePath("/guests")
        return { success: "Invité mis à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la modification." }
    }
}

export async function deleteGuest(id: string) {
    try {
        await prisma.guest.delete({
            where: { id },
        })
        revalidatePath("/guests")
        revalidatePath("/dashboard")
        return { success: "Invité supprimé !" }
    } catch (error) {
        return { error: "Erreur lors de la suppression." }
    }
}
