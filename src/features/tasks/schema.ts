import * as z from "zod"

export const TaskSchema = z.object({
    title: z.string().min(2, {
        message: "Le titre doit contenir au moins 2 caractères.",
    }),
    description: z.string().optional(),
    dueDate: z.date().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

export type TaskFormValues = z.infer<typeof TaskSchema>

export interface Task {
    id: string
    title: string
    description?: string | null
    dueDate?: Date | null
    status: "TODO" | "IN_PROGRESS" | "DONE"
    priority: "LOW" | "MEDIUM" | "HIGH"
}
