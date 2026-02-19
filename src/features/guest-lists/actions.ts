"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { GuestListSchema, GuestListFormValues } from "./schema"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getGuestLists() {
    try {
        const lists = await prisma.guestList.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: "asc" },
            include: {
                _count: {
                    select: { guests: true }
                }
            }
        })
        return { data: lists }
    } catch (error) {
        return { error: "Impossible de récupérer les listes." }
    }
}

export async function createGuestList(values: GuestListFormValues) {
    const validatedFields = GuestListSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const list = await prisma.guestList.create({
            data: {
                ...validatedFields.data,
                userId: MOCK_USER_ID,
            },
        })

        revalidatePath("/guests")
        return { success: "Liste créée !", data: list }
    } catch (error) {
        return { error: "Erreur lors de la création." }
    }
}

export async function deleteGuestList(id: string) {
    try {
        await prisma.guestList.delete({
            where: { id },
        })

        revalidatePath("/guests")
        return { success: "Liste supprimée !" }
    } catch (error) {
        return { error: "Erreur lors de la suppression." }
    }
}
