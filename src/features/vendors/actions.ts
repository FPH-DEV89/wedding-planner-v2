"use server"

import prisma from "@/lib/prisma"
import { VendorSchema, VendorFormValues } from "./schema"
import { revalidatePath } from "next/cache"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getVendors() {
    try {
        const vendors = await prisma.vendor.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: "desc" },
        })
        return { data: vendors }
    } catch (error) {
        return { error: "Impossible de récupérer les prestataires." }
    }
}

export async function createVendor(values: VendorFormValues) {
    const validatedFields = VendorSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const vendor = await prisma.vendor.create({
            data: {
                ...validatedFields.data,
                userId: MOCK_USER_ID,
            },
        })

        revalidatePath("/vendors")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Prestataire ajouté !", data: vendor }
    } catch (error) {
        return { error: "Erreur lors de l'ajout." }
    }
}

export async function updateVendor(id: string, values: VendorFormValues) {
    const validatedFields = VendorSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        await prisma.vendor.update({
            where: { id },
            data: {
                ...validatedFields.data,
            },
        })

        revalidatePath("/vendors")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Prestataire mis à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la modification." }
    }
}

export async function deleteVendor(id: string) {
    try {
        await prisma.vendor.delete({
            where: { id },
        })
        revalidatePath("/vendors")
        revalidatePath("/budget")
        revalidatePath("/dashboard")
        return { success: "Prestataire supprimé !" }
    } catch (error) {
        return { error: "Erreur lors de la suppression." }
    }
}
