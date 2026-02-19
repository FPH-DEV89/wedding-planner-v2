import { z } from "zod"

export const PurchaseSchema = z.object({
    type: z.string().min(1, "Le type est requis"),
    price: z.coerce.number().min(0),
    quantity: z.coerce.number().int().min(1, "La quantité doit être au moins 1"),
    isPaid: z.boolean().default(false),
    link: z.string().url("URL invalide").optional().nullable().or(z.literal("")),
})

export type PurchaseFormValues = z.infer<typeof PurchaseSchema>

export interface Purchase {
    id: string
    type: string
    price: number
    quantity: number
    isPaid: boolean
    link?: string | null
    createdAt: Date
}
