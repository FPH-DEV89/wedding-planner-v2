"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { GuestSchema, GuestFormValues } from "./schema"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getGuests(listId?: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const userId = SHARED_USER_ID

    try {
        const guests = await prisma.guest.findMany({
            where: {
                userId,
                ...(listId ? { listId } : {})
            },
            orderBy: { createdAt: "desc" },
        })
        return { data: guests }
    } catch (error) {
        console.error("Erreur guests:", error)
        return { error: "Impossible de récupérer les invités." }
    }
}

export async function createGuest(values: GuestFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = GuestSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const userId = SHARED_USER_ID

        // The original code handled listId: listId || null.
        // Assuming validatedFields.data already contains listId in the correct format (null if empty/undefined),
        // or that the schema ensures it's either a string or null.
        // If listId can be an empty string from the form, and should be stored as null,
        // then validatedFields.data.listId might need explicit conversion.
        // For now, we'll spread validatedFields.data directly.
        const { listId, ...rest } = validatedFields.data

        const guest = await prisma.guest.create({
            data: {
                ...rest,
                listId: listId || null, // Ensure listId is null if empty
                userId,
            },
        })

        revalidatePath("/guests")
        revalidatePath("/dashboard")
        return { success: "Invité ajouté !", data: guest }
    } catch (error) {
        console.error("Erreur guests:", error)
        return { error: "Erreur lors de la création de l'invité." }
    }
}

export async function updateGuest(id: string, values: GuestFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = GuestSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const { listId, ...rest } = validatedFields.data

        const updated = await prisma.guest.updateMany({
            where: { id, userId: SHARED_USER_ID },
            data: {
                ...rest,
                listId: listId || null,
            },
        })

        if (updated.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/guests")
        return { success: "Invité mis à jour !" }
    } catch (error) {
        console.error("Erreur guests:", error)
        return { error: "Erreur lors de la modification." }
    }
}

export async function deleteGuest(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    try {
        const deleted = await prisma.guest.deleteMany({
            where: { id, userId: SHARED_USER_ID },
        })

        if (deleted.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/guests")
        revalidatePath("/dashboard")
        return { success: "Invité supprimé !" }
    } catch (error) {
        console.error("Erreur guests:", error)
        return { error: "Erreur lors de la suppression." }
    }
}
