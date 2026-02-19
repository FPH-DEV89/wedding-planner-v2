import * as z from "zod"

export const GuestListSchema = z.object({
    name: z.string().min(2, {
        message: "Le nom de la liste doit contenir au moins 2 caractères.",
    }),
})

export type GuestListFormValues = z.infer<typeof GuestListSchema>
