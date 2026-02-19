"use server"

import prisma from "@/lib/prisma"
import { TaskSchema, TaskFormValues, Task } from "./schema"
import { revalidatePath } from "next/cache"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export async function getTasks() {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: MOCK_USER_ID },
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
        const task = await prisma.task.create({
            data: {
                ...validatedFields.data,
                userId: MOCK_USER_ID,
            },
        })

        revalidatePath("/tasks")
        revalidatePath("/dashboard")
        return { success: "Tâche ajoutée !", data: task }
    } catch (error) {
        return { error: "Erreur lors de la création." }
    }
}

export async function updateTaskStatus(id: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
    try {
        await prisma.task.update({
            where: { id },
            data: { status }
        })
        revalidatePath("/tasks")
        return { success: "Statut mis à jour !" }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour." }
    }
}
