"use server"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { GuestListSchema, GuestListFormValues } from "./schema"

export async function getGuestLists() {
    const userId = SHARED_USER_ID

    try {
        const lists = await prisma.guestList.findMany({
            where: { userId },
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
        const userId = SHARED_USER_ID

        const list = await prisma.guestList.create({
            data: {
                ...validatedFields.data,
                userId,
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
