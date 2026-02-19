import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const updateUser = async (data: { name: string }) => {
    const session = await auth()

    if (!session?.user?.email) {
        return { error: "Non autorisé" }
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { name: data.name }
        })

        revalidatePath("/")
        return { success: "Profil mis à jour avec succès" }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour du profil" }
    }
}
