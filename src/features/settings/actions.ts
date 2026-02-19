"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export const updateUser = async (data: { name: string }) => {
    const session = await auth()
    const userId = session?.user?.id || MOCK_USER_ID

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { name: data.name }
        })

        revalidatePath("/")
        return { success: "Profil mis à jour avec succès" }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour du profil" }
    }
}
