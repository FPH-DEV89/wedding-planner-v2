import * as z from "zod"

export const GuestSchema = z.object({
    name: z.string().min(2, {
        message: "Le nom doit contenir au moins 2 caractères.",
    }),
    relation: z.string().optional(),
    category: z.string().optional(),
    listId: z.string().optional(),
})

export type GuestFormValues = z.infer<typeof GuestSchema>
