import * as z from "zod"

export const BudgetSchema = z.object({
    name: z.string().min(2, {
        message: "Le nom de la dépense doit contenir au moins 2 caractères.",
    }),
    category: z.string().min(1, {
        message: "Veuillez choisir une catégorie.",
    }),
    amount: z.coerce.number().min(0),
    paidAmount: z.coerce.number().min(0).default(0),
})

export type BudgetFormValues = z.infer<typeof BudgetSchema>
