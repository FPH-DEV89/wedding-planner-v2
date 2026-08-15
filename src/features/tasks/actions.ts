"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { TaskSchema, TaskFormValues, Task } from "./schema"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getTasks() {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const userId = SHARED_USER_ID

    try {
        const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
        return { data: tasks as any as Task[] }
    } catch (error) {
        console.error("Erreur tasks:", error)
        return { error: "Impossible de récupérer les tâches." }
    }
}

export async function createTask(values: TaskFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = TaskSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const userId = SHARED_USER_ID
        const { time, ...data } = validatedFields.data

        await prisma.task.create({
            data: {
                ...data,
                userId,
            },
        })

        revalidatePath("/tasks")
        revalidatePath("/timeline")
        revalidatePath("/dashboard")
        return { success: "Tâche ajoutée !" }
    } catch (error: any) {
        console.error("Erreur tasks:", error)
        return { error: "Une erreur est survenue. Réessayez plus tard." }
    }
}

export async function updateTask(id: string, values: TaskFormValues) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    const validatedFields = TaskSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const { time, ...data } = validatedFields.data
        const updated = await prisma.task.updateMany({
            where: { id, userId: SHARED_USER_ID },
            data: {
                ...data,
            },
        })

        if (updated.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/tasks")
        revalidatePath("/timeline")
        revalidatePath("/dashboard")
        return { success: "Tâche mise à jour !" }
    } catch (error) {
        console.error("Erreur tasks:", error)
        return { error: "Erreur lors de la modification." }
    }
}

export async function deleteTask(id: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    try {
        const deleted = await prisma.task.deleteMany({
            where: { id, userId: SHARED_USER_ID },
        })

        if (deleted.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/tasks")
        revalidatePath("/timeline")
        revalidatePath("/dashboard")
        return { success: "Tâche supprimée !" }
    } catch (error) {
        console.error("Erreur tasks:", error)
        return { error: "Erreur lors de la suppression." }
    }
}

export async function updateTaskStatus(id: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
    const session = await auth()
    if (!session?.user) throw new Error("Non authentifié")

    try {
        const updated = await prisma.task.updateMany({
            where: { id, userId: SHARED_USER_ID },
            data: { status }
        })

        if (updated.count === 0) return { error: "Élément introuvable" }

        revalidatePath("/tasks")
        revalidatePath("/timeline")
        return { success: "Statut mis à jour !" }
    } catch (error) {
        console.error("Erreur tasks:", error)
        return { error: "Erreur lors de la mise à jour." }
    }
}
