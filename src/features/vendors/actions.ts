"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { VendorSchema, VendorFormValues } from "./schema"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getVendors() {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const userId = SHARED_USER_ID

    try {
        const vendors = await prisma.vendor.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
        return { data: vendors }
    } catch (error) {
        console.error("Erreur vendors:", error)
        return { error: "Impossible de récupérer les prestataires." }
    }
}

export async function createVendor(values: VendorFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = VendorSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const userId = SHARED_USER_ID

        const vendor = await prisma.vendor.create({
            data: {
                ...validatedFields.data,
                userId,
            },
        })

        revalidatePath("/vendors")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Prestataire ajouté !", data: vendor }
    } catch (error) {
        console.error("Erreur vendors:", error)
        return { error: "Erreur lors de l'ajout." }
    }
}

export async function updateVendor(id: string, values: VendorFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = VendorSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const updated = await prisma.vendor.updateMany({
            where: { id, userId: SHARED_USER_ID },
            data: {
                ...validatedFields.data,
            },
        })

        if (updated.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/vendors")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Prestataire mis à jour !" }
    } catch (error) {
        console.error("Erreur vendors:", error)
        return { error: "Erreur lors de la modification." }
    }
}

export async function deleteVendor(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    try {
        const deleted = await prisma.vendor.deleteMany({
            where: { id, userId: SHARED_USER_ID },
        })

        if (deleted.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/vendors")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Prestataire supprimé !" }
    } catch (error) {
        console.error("Erreur vendors:", error)
        return { error: "Erreur lors de la suppression." }
    }
}
