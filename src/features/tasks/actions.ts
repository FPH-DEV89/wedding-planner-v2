"use server"

import prisma from "@/lib/prisma"
import { TaskSchema, TaskFormValues, Task } from "./schema"
import { revalidatePath } from "next/cache"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getTasks() {
    const userId = SHARED_USER_ID

    try {
        const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
        return { data: tasks as any as Task[] }
    } catch (error) {
        return { error: "Impossible de récupérer les tâches." }
    }
}

export async function createTask(values: TaskFormValues) {
    const validatedFields = TaskSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const userId = SHARED_USER_ID
        const { time, ...data } = validatedFields.data

        const task = await prisma.task.create({
            data: {
                ...data,
                userId,
            },
        })

        revalidatePath("/tasks")
        revalidatePath("/timeline")
        revalidatePath("/dashboard")
        return { success: "Tâche ajoutée !", data: task }
    } catch (error) {
        return { error: "Erreur lors de la création." }
    }
}

export async function updateTask(id: string, values: TaskFormValues) {
    const validatedFields = TaskSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Champs invalides." }
    }

    try {
        const { time, ...data } = validatedFields.data
        await prisma.task.update({
            where: { id },
            data: {
                ...data,
            },
        })

        revalidatePath("/tasks")
        revalidatePath("/timeline")
        revalidatePath("/dashboard")
        return { success: "Tâche mise à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la modification." }
    }
}

export async function deleteTask(id: string) {
    try {
        await prisma.task.delete({
            where: { id },
        })
        revalidatePath("/tasks")
        revalidatePath("/timeline")
        revalidatePath("/dashboard")
        return { success: "Tâche supprimée !" }
    } catch (error) {
        return { error: "Erreur lors de la suppression." }
    }
}

export async function updateTaskStatus(id: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
    try {
        await prisma.task.update({
            where: { id },
            data: { status }
        })
        revalidatePath("/tasks")
        revalidatePath("/timeline")
        return { success: "Statut mis à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour." }
    }
}
